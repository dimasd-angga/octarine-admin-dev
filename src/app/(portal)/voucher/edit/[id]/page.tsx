"use client";

import { IVoucher } from "@interface/voucher";
import { Select, Text, TextInput, NumberInput, Switch } from "@mantine/core";
import { Edit, useForm } from "@refinedev/mantine";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const VoucherEdit = () => {
  const { saveButtonProps, getInputProps, values, setFieldValue, errors } =
    useForm({
      initialValues: {
        code: "",
        name: "",
        description: "",
        type: "PERCENTAGE",
        discountValue: 0,
        maxDiscountAmount: 0,
        minOrderAmount: 0,
        validFrom: new Date().toISOString(),
        validUntil: new Date().toISOString(),
        usageLimit: 1073741824,
        enabled: true,
      },
      validate: {
        code: (value) => (value.length < 1 ? "Code is required" : null),
        name: (value) => (value.length < 1 ? "Name is required" : null),
        description: (value) =>
          value.length < 10 ? "Description too short" : null,
        discountValue: (value) =>
          value < 0 ? "Discount must be non-negative" : null,
        maxDiscountAmount: (value) =>
          value < 0 ? "Max discount must be non-negative" : null,
        minOrderAmount: (value) =>
          value < 0 ? "Min order must be non-negative" : null,
        validFrom: (value) => (!value ? "Valid from is required" : null),
        validUntil: (value) => (!value ? "Valid until is required" : null),
      },
      refineCoreProps: {
        resource: "voucher",
        action: "edit",
        onMutationSuccess: (data) => {
          console.log("Data updated:", data);
        },
      },
    });

  const handleEditorChange = (content: string) => {
    setFieldValue("description", content);
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <form>
        <TextInput
          mt={8}
          label="Code"
          placeholder="Enter code"
          {...getInputProps("code")}
        />
        <TextInput
          mt={8}
          label="Name"
          placeholder="Enter name"
          {...getInputProps("name")}
        />
        <TextInput
          mt={8}
          label="Type"
          placeholder="PERCENTAGE"
          disabled
          {...getInputProps("type")}
        />
        <NumberInput
          mt={8}
          label="Discount Value"
          placeholder="Enter discount value"
          min={0}
          {...getInputProps("discountValue")}
        />
        <NumberInput
          mt={8}
          label="Max Discount Amount"
          placeholder="Enter max discount amount"
          min={0}
          {...getInputProps("maxDiscountAmount")}
        />
        <NumberInput
          mt={8}
          label="Min Order Amount"
          placeholder="Enter min order amount"
          min={0}
          {...getInputProps("minOrderAmount")}
        />
        <TextInput
          mt={8}
          label="Valid From"
          type="datetime-local"
          {...getInputProps("validFrom")}
          value={values.validFrom.slice(0, 16)}
          onChange={(event) =>
            setFieldValue(
              "validFrom",
              new Date(event.target.value).toISOString()
            )
          }
        />
        <TextInput
          mt={8}
          label="Valid Until"
          type="datetime-local"
          {...getInputProps("validUntil")}
          value={values.validUntil.slice(0, 16)}
          onChange={(event) =>
            setFieldValue(
              "validUntil",
              new Date(event.target.value).toISOString()
            )
          }
        />
        <NumberInput
          mt={8}
          label="Usage Limit"
          placeholder="Enter usage limit"
          min={0}
          {...getInputProps("usageLimit")}
        />
        <Text mt={8} weight={500} size="sm" color="#212529">
          Description
        </Text>
        <ReactQuill
          theme="snow"
          value={values.description}
          onChange={handleEditorChange}
          style={{ height: "200px", marginBottom: "40px" }}
        />
        {errors.description && (
          <Text mt={2} weight={500} size="xs" color="red">
            {errors.description}
          </Text>
        )}
      </form>
    </Edit>
  );
};

export default VoucherEdit;
