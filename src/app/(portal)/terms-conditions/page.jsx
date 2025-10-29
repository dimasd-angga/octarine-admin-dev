"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useForm } from "@refinedev/mantine";
import { useOne, useUpdate, useCreate } from "@refinedev/core";
import {
  TextInput,
  Container,
  Title,
  Card,
  Group,
  Loader,
  Button,
} from "@mantine/core";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { showNotification } from "@mantine/notifications";

// ✅ Dynamic import for ReactQuill (Next.js SSR safe)
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  { ssr: false }
);

export default function TermAndConditionEdit() {
  const [editorValue, setEditorValue] = useState("");
  const quillRef = useRef(null);

  // ✅ API hooks
  const { data, isLoading } = useOne({
    resource: "pages/terms-and-conditions",
    id: null,
  });

  const { mutate: update, isPending: isSaving } = useUpdate();
  const { mutateAsync: uploadFile } = useCreate();

  // ✅ Form setup
  const form = useForm({
    initialValues: { title: "" },
  });

  // ✅ Populate existing data safely
  useEffect(() => {
    if (data?.data) {
      const res = data.data;
      form.setValues({
        title: res?.title ?? "",
      });
      setEditorValue(res?.content ?? "");
    }
  }, [data]);

  // ✅ Image upload handler
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await uploadFile({
          resource: "pages/terms-and-conditions/upload",
          values: formData,
        });

        const imageUrl = res?.data?.url || res?.data?.path;
        if (!imageUrl) throw new Error("No URL returned from upload");

        const quill = quillRef.current?.getEditor?.();
        if (!quill) throw new Error("Quill not ready");

        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", imageUrl);
      } catch (err) {
        console.error("Upload failed:", err);
        showNotification({
          title: "Error",
          message: "Image upload failed",
          color: "red",
        });
      }
    };
  }, [uploadFile]);

  // ✅ Quill modules (memoized to prevent re-renders)
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: { image: imageHandler },
      },
    }),
    []
  );

  // ✅ Submit handler
  const handleSubmit = form.onSubmit((values) => {
    update(
      {
        resource: "pages/terms-and-conditions",
        id: null,
        values: {
          title: values.title,
          content: editorValue,
        },
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "Terms and Conditions updated successfully",
            color: "green",
          });
        },
        onError: () => {
          showNotification({
            title: "Error",
            message: "Failed to update Terms and Conditions",
            color: "red",
          });
        },
      }
    );
  });

  // ✅ Loading state
  if (isLoading)
    return (
      <Container size="lg" mt="xl">
        <Group position="center">
          <Loader />
        </Group>
      </Container>
    );

  return (
    <Container size="lg" mt="xl">
      <Card shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2} mb="lg">
          Edit Terms and Conditions
        </Title>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <TextInput
            label="Page Title"
            {...form.getInputProps("title")}
            className="form-group"
          />

          {/* Content */}
          <div className="form-group" style={{ marginTop: 20 }}>
            <Title order={4} mb="sm">
              Content
            </Title>
            <ReactQuill
              forwardedRef={quillRef}
              theme="snow"
              value={editorValue}
              onChange={setEditorValue}
              modules={modules}
              style={{ minHeight: "300px" }}
            />
          </div>

          {/* Save Button */}
          <Group position="right" mt="xl">
            <Button type="submit" loading={isSaving}>
              Update
            </Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
}
