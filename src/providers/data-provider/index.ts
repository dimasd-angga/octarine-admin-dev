"use client";

import dataProviderSimpleRest from "@refinedev/simple-rest";
import queryString from "query-string";
import axios, { AxiosInstance } from "axios";
import {
  CrudFilters,
  CrudOperators,
  DataProvider,
  BaseRecord,
  GetListParams,
  CreateParams,
  UpdateParams,
} from "@refinedev/core";
import { axiosInstance } from "@service/axiosInstance";

export const API_URL = "https://octarinedev.mhafizsir.com/admin";

const mapOperator = (operator: CrudOperators): string => {
  switch (operator) {
    case "eq":
      return "";
    default:
      throw new Error(`Operator ${operator} is not supported`);
  }
};

const generateFilter = (filters?: CrudFilters) => {
  const queryFilters: { [key: string]: string } = {};
  if (filters) {
    filters.forEach((filter: any) => {
      if (
        filter.operator !== "or" &&
        filter.operator !== "and" &&
        "field" in filter
      ) {
        const { field, operator, value } = filter;
        const mappedOperator = mapOperator(operator);
        queryFilters[`${field}${mappedOperator}`] = value;
      }
    });
  }
  return queryFilters;
};

export const dataProvider = (axios: AxiosInstance): DataProvider => ({
  ...dataProviderSimpleRest(API_URL, axios),
  custom: async ({ url: resource, filters }) => {
    const url = new URL(`${API_URL}/${resource}`);
    const queryFilters = generateFilter(filters);
    url.search = queryString.stringify({ ...queryFilters });
    const { data } = await axiosInstance.get(url.toString());
    return data;
  },
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
    pagination,
    filters,
    meta,
  }: GetListParams) => {
    const url = new URL(`${API_URL}/${resource}`);

    // Pagination
    const current = pagination?.current || 1;
    const pageSize = pagination?.pageSize || 10;

    const queryFilters = generateFilter(filters);

    const query = {
      page: current.toString(),
      size: pageSize.toString(),
    };

    url.search = queryString.stringify({ ...query, ...queryFilters });

    const { data } = await axiosInstance.get(url.toString());

    // Handle array response
    if (Array.isArray(data)) {
      return {
        data: data as TData[],
        total: data.length,
      };
    }
    // Handle paginated response
    if (data.content && data.page) {
      return {
        data: data.content as TData[],
        total: data.page.totalElements as number,
      };
    }

    // Throw an error for unexpected response structure
    throw new Error("Unexpected data structure from API");
  },
  create: async <TData extends BaseRecord = BaseRecord, TVariables = any>({
    resource,
    variables,
    meta,
  }: CreateParams<TVariables>) => {
    const url = `${API_URL}/${resource}`;
    const { headers } = meta ?? {};

    const response = await axios.post(url, variables, {
      headers: {
        ...headers,
        ...(variables instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" }),
      },
    });

    console.log("DataProvider post response:", response.data);

    return {
      data: response.data as TData,
    };
  },
  update: async <TData extends BaseRecord = BaseRecord, TVariables = any>({
    resource,
    id,
    variables,
    meta,
  }: UpdateParams<TVariables>) => {
    const url = `${API_URL}/${resource}/${id}`;
    const { headers } = meta ?? {};

    const response = await axios.put(url, variables, {
      headers: {
        ...headers,
        ...(variables instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" }),
      },
    });

    console.log("DataProvider update response:", response.data);

    return { data: response.data as TData };
  },
});
