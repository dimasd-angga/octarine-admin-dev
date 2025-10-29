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
  GetOneParams,
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
  custom: async ({ url: resource, filters, method = "get" }) => {
    const url = new URL(`${API_URL}/${resource}`);
    const queryFilters = generateFilter(filters);
    url.search = queryString.stringify({ ...queryFilters });
    const { data } = await axiosInstance[method](url.toString());
    return data;
  },
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
    pagination,
    filters,
    sorters,
  }: GetListParams) => {
    const url = new URL(`${API_URL}/${resource}`);

    let query: any = {
      enabled: true,
    };

    if (pagination?.mode != "off") {
      // Pagination
      const current = pagination?.current || 1;
      const pageSize = pagination?.pageSize || 10;

      const queryFilters = generateFilter(filters);

      query = {
        ...query,
        ...queryFilters,
        page: current.toString(),
        size: pageSize.toString(),
      };
    }

    if (sorters && sorters.length > 0) {
      const sorter = sorters[0];
      query = { ...query, soryBy: sorter.field, sortDir: sorter.order };
    }

    if (Object.keys(query).length > 0) {
      url.search = queryString.stringify({ ...query });
    }

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
    // Handle paginated response v2
    if (data.content && data.totalElements) {
      return {
        data: data.content as TData[],
        total: data.totalElements as number,
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
    let url = `${API_URL}/${resource}`;
    if (id) {
      if (resource.includes(":id")) {
        url = url.replace(":id", id.toString());
      } else {
        url = url.concat(`/${id}`);
      }
    }
    const { headers, operation = "put" } = meta ?? {};
    let response = null;
    switch (operation) {
      case "post":
        response = await axios.post(url, variables, {
          headers: {
            ...headers,
            ...(variables instanceof FormData
              ? { "Content-Type": "multipart/form-data" }
              : { "Content-Type": "application/json" }),
          },
        });
        break;
      default:
        response = await axios.put(url, variables, {
          headers: {
            ...headers,
            ...(variables instanceof FormData
              ? { "Content-Type": "multipart/form-data" }
              : { "Content-Type": "application/json" }),
          },
        });
        break;
    }

    console.log("DataProvider update response:", response.data);

    return { data: response.data as TData };
  },
  getOne: async ({ resource, id }: GetOneParams) => {
    let url = `${API_URL}/${resource}`;
    if (id) {
      url = url.concat(`/${id}`);
    }
    const { data } = await axiosInstance.get(url);
    return { data };
  },
});
