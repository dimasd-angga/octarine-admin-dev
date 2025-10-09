"use client";

import { Select, Text, TextInput } from "@mantine/core";
import { Edit, useForm } from "@refinedev/mantine";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CareerEdit = () => {
  const { saveButtonProps, getInputProps, values, setFieldValue, errors } =
    useForm({
      initialValues: {
        title: "",
        department: "",
        responsibilities: "",
        employmentType: "",
        location: "",
        url: "",
      },
      validate: {
        title: (value) => (value.length < 2 ? "Too short title" : null),
        department: (value) =>
          value.length <= 0 ? "Status is required" : null,
        responsibilities: (value) =>
          value.length < 10 ? "Too short conten " : null,
      },
    });

  const handleEditorChange = (content: string) => {
    setFieldValue("responsibilities", content);
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <form>
        <TextInput
          mt={8}
          label="Title"
          placeholder="Title"
          {...getInputProps("title")}
        />
        <TextInput
          mt={8}
          label="department"
          placeholder="department"
          {...getInputProps("department")}
        />
        <Select
          mt={8}
          label="Employment Type"
          placeholder="Employment Type"
          data={[
            { label: "Full Time", value: "Full Time" },
            { label: "Part Time", value: "Part Time" },
          ]}
          {...getInputProps("employmentType")}
        />
        <TextInput
          mt={8}
          label="Location"
          placeholder="Location"
          {...getInputProps("location")}
        />
        <TextInput
          mt={8}
          label="URL"
          placeholder="URL"
          {...getInputProps("url")}
        />
        <Text mt={8} weight={500} size="sm" color="#212529">
          Content
        </Text>
        <ReactQuill
          theme="snow" // Tema default dengan toolbar
          value={values.responsibilities} // Nilai saat ini dari form
          onChange={handleEditorChange} // Handle perubahan konten
          style={{ height: "200px", marginBottom: "40px" }} // Atur tinggi dan jarak bawah
        />
        {errors.responsibilities && (
          <Text mt={2} weight={500} size="xs" color="red">
            {errors.responsibilities}
          </Text>
        )}
      </form>
    </Edit>
  );
};

export default CareerEdit;
