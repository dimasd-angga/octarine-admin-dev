"use client";

import { Switch, Text, TextInput } from "@mantine/core";
import { Create, useForm } from "@refinedev/mantine";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const TypeCreate: React.FC = () => {
  const router = useRouter();
  const { saveButtonProps, getInputProps, values, setFieldValue, errors } =
    useForm({
      initialValues: {
        name: "",
        description: "",
        enabled: true,
      },
      refineCoreProps: {
        resource: "product/type/create",
        onMutationSuccess: (data) => {
          router.push("/type");
        },
      },
      validate: {
        name: (value) => (value.length < 2 ? "Name too short" : null),
        description: (value) =>
          value.length < 10 ? "Description too short" : null,
      },
    });

  const handleEditorChange = (value: string) => {
    setFieldValue("description", value);
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
          label="Name"
          placeholder="Enter name"
          {...getInputProps("name")}
        />
        <Text mt={8} weight={500} size="sm" color="#212529">
          Description
        </Text>
        <ReactQuill
          theme="snow"
          value={values.description}
          onChange={handleEditorChange}
          style={{ background: "white" }}
          modules={modules}
        />
        {errors.description && (
          <Text mt={2} weight={500} size="xs" color="red">
            {errors.description}
          </Text>
        )}
        <Switch
          mt={8}
          label="Enabled"
          checked={values.enabled}
          onChange={(event) =>
            setFieldValue("enabled", event.currentTarget.checked)
          }
        />
      </form>
    </Create>
  );
};

export default TypeCreate;
