"use client";

import { Select, Text, TextInput } from "@mantine/core";
import { Create, useForm } from "@refinedev/mantine";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const CareerCreate: React.FC = () => {
  const { saveButtonProps, getInputProps, values, setFieldValue, errors } =
    useForm({
      initialValues: {
        title: "",
        department: "",
        responsibilities: "",
        url: "",
      },
      refineCoreProps: {
        resource: "career/create",
        onMutationSuccess: (data) => {
          console.log("Data tersimpan:", data);
        },
      },
      validate: {
        title: (value) => (value.length < 2 ? "Judul terlalu pendek" : null),
        department: (value) =>
          value.length <= 0 ? "Departemen wajib diisi" : null,
        responsibilities: (value) =>
          value.length < 10 ? "Konten terlalu pendek" : null,
      },
    });

  const handleEditorChange = (value: string) => {
    setFieldValue("responsibilities", value);
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
    <Create saveButtonProps={saveButtonProps}>
      <form>
        <TextInput
          mt={8}
          label="Judul"
          placeholder="Judul"
          {...getInputProps("title")}
        />
        <TextInput
          mt={8}
          label="Departemen"
          placeholder="Departemen"
          {...getInputProps("department")}
        />
        <Select
          mt={8}
          label="Tipe Pekerjaan"
          placeholder="Tipe Pekerjaan"
          data={[
            { label: "Full Time", value: "Full Time" },
            { label: "Part Time", value: "Part Time" },
          ]}
          {...getInputProps("employmentType")}
        />
        <TextInput
          mt={8}
          label="Lokasi"
          placeholder="Lokasi"
          {...getInputProps("location")}
        />
        <TextInput
          mt={8}
          label="URL"
          placeholder="URL"
          {...getInputProps("url")}
        />
        <Text mt={8} weight={500} size="sm" color="#212529">
          Konten
        </Text>
        <ReactQuill
          theme="snow"
          value={values.responsibilities}
          onChange={handleEditorChange}
          style={{ height: "200px", marginBottom: "40px" }}
          modules={modules}
        />
        {errors.responsibilities && (
          <Text mt={2} weight={500} size="xs" color="red">
            {errors.responsibilities}
          </Text>
        )}
      </form>
    </Create>
  );
};

export default CareerCreate;
