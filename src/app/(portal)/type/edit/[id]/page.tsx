"use client";

import { Switch, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Edit } from "@refinedev/mantine";
import { useOne, useUpdate } from "@refinedev/core";
import { useParams, useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const TypeEdit: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { mutate, isLoading: isSaving } = useUpdate();

  const { data: typeData, isLoading } = useOne({
    resource: "product/type",
    id,
  });

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      enabled: true,
    },
    validate: {
      name: (value) => (value.length < 2 ? "Name too short" : null),
      description: (value) =>
        value.length < 10 ? "Description too short" : null,
    },
  });

  // Populate form with existing data
  useEffect(() => {
    if (typeData?.data) {
      const data = typeData.data as {
        name: string;
        description: string;
        enabled: boolean;
      };
      form.setValues({
        name: data.name || "",
        description: data.description || "",
        enabled: data.enabled ?? true,
      });
    }
  }, [typeData]);

  const handleSubmit = (values: typeof form.values) => {
    const payload = {
      id: id.replaceAll("%20", " "),
      name: values.name,
      description: values.description,
      enabled: values.enabled,
    };

    mutate(
      {
        resource: "product/type",
        id: "",
        values: payload,
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "Product type updated successfully!",
            color: "green",
          });
          router.push("/type");
        },
        onError: (error) => {
          console.error("Update failed:", error);
          showNotification({
            title: "Error",
            message: "Failed to update product type",
            color: "red",
          });
        },
      },
    );
  };

  const handleEditorChange = (value: string) => {
    form.setFieldValue("description", value);
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    },
  };

  return (
    <Edit
      saveButtonProps={{
        onClick: () => form.onSubmit(handleSubmit),
        loading: isSaving,
      }}
      isLoading={isLoading}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          mt={8}
          label="Name"
          placeholder="Enter name"
          {...form.getInputProps("name")}
        />
        <Text mt={8} weight={500} size="sm" color="#212529">
          Description
        </Text>
        <ReactQuill
          theme="snow"
          value={form.values.description}
          onChange={handleEditorChange}
          style={{ height: "200px", marginBottom: "40px" }}
          modules={modules}
        />
        {form.errors.description && (
          <Text mt={2} weight={500} size="xs" color="red">
            {form.errors.description}
          </Text>
        )}
      </form>
    </Edit>
  );
};

export default TypeEdit;
