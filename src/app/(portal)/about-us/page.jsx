"use client";

import { useEffect, useState } from "react";
import {
    TextInput,
    Textarea,
    FileInput,
    SimpleGrid,
    Container,
    Title,
    Card,
    Group,
    Loader,
    Button,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useOne, useUpdate, useCreate } from "@refinedev/core";

export default function AboutEdit() {
    const sections = [
        { key: "fragrant", label: "Fragrant" },
        { key: "discover", label: "Discover" },
        { key: "story", label: "Story" },
    ];

    // 🔁 Loading states per upload field
    const [uploadingFields, setUploadingFields] = useState({});

    // 🟢 Get About Us Data
    const { data: aboutData, isLoading: isLoadingAbout } = useOne({
        resource: "pages/about-us",
        id: null,
    });

    // 🟠 Update
    const { mutate: updatePage, isLoading: updating } = useUpdate();

    // 🟣 Upload
    const { mutate: uploadFile } = useCreate();

    // 🧩 Form
    const form = useForm({
        initialValues: {
            heroImage: "",
            about: { image: "", title: "", description: "", buttonText: "" },
            fragrant: { image: "", title: "", description: "" },
            discover: { image: "", title: "", description: "" },
            story: { image: "", title: "", description: "" },
        },
    });

    // Prefill
    useEffect(() => {
        if (aboutData?.data) {
            const d = aboutData.data;
            form.setValues({
                heroImage: d?.heroImage || "",
                about: {
                    image: d?.about?.image || "",
                    title: d?.about?.title || "",
                    description: d?.about?.description || "",
                    buttonText: d?.about?.buttonText || "",
                },
                fragrant: {
                    image: d?.fragrant?.image || "",
                    title: d?.fragrant?.title || "",
                    description: d?.fragrant?.description || "",
                },
                discover: {
                    image: d?.discover?.image || "",
                    title: d?.discover?.title || "",
                    description: d?.discover?.description || "",
                },
                story: {
                    image: d?.story?.image || "",
                    title: d?.story?.title || "",
                    description: d?.story?.description || "",
                },
            });
        }
    }, [aboutData]);

    // 📤 Upload file (per-field loading)
    const handleUpload = (file, field) => {
        if (!file) return;

        // start loader for this field
        setUploadingFields((prev) => ({ ...prev, [field]: true }));

        const formData = new FormData();
        formData.append("file", file);

        uploadFile(
            {
                resource: "pages/about-us/upload",
                values: formData,
            },
            {
                onSuccess: (res) => {
                    const url = res?.data?.url;
                    if (url) form.setFieldValue(field, url);
                    setUploadingFields((prev) => ({ ...prev, [field]: false }));
                    showNotification({
                        title: "Uploaded",
                        message: "Image uploaded successfully",
                        color: "green",
                    });
                },
                onError: () => {
                    setUploadingFields((prev) => ({ ...prev, [field]: false }));
                    showNotification({
                        title: "Error",
                        message: "Upload failed",
                        color: "red",
                    });
                },
            }
        );
    };

    // 💾 Submit
    const handleSubmit = (values) => {
        updatePage(
            {
                resource: "pages/about-us",
                id: null,
                values,
            },
            {
                onSuccess: () => {
                    showNotification({
                        title: "Success",
                        message: "About Us updated successfully",
                        color: "green",
                    });
                },
                onError: () => {
                    showNotification({
                        title: "Error",
                        message: "Failed to update About Us",
                        color: "red",
                    });
                },
            }
        );
    };

    if (isLoadingAbout) {
        return (
            <Group position="center" mt="xl">
                <Loader size="lg" />
            </Group>
        );
    }

    return (
        <Container size="lg" mt="xl">
            <Card shadow="sm" p="xl" radius="md" withBorder>
                <Title order={2} mb="lg">
                    Edit About Us Page
                </Title>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    {/* 🖼 Hero Section */}
                    <Title order={4} mb="sm">
                        Hero Section
                    </Title>
                    <FileInput
                        label="Hero Background Image"
                        placeholder="Upload hero image"
                        onChange={(file) => handleUpload(file, "heroImage")}
                        rightSection={
                            uploadingFields["heroImage"] ? <Loader size="xs" /> : null
                        }
                    />
                    {form.values.heroImage && (
                        <img
                            src={form.values.heroImage}
                            alt="Hero Preview"
                            style={{
                                width: "100%",
                                marginTop: 10,
                                borderRadius: 8,
                                maxWidth: "120px",
                            }}
                        />
                    )}

                    {/* 🟣 About Section */}
                    <Title order={4} mt="xl" mb="sm">
                        About Octarine Section
                    </Title>
                    <FileInput
                        label="About Image"
                        placeholder="Upload image"
                        onChange={(file) => handleUpload(file, "about.image")}
                        rightSection={
                            uploadingFields["about.image"] ? <Loader size="xs" /> : null
                        }
                    />
                    {form.values.about.image && (
                        <img
                            src={form.values.about.image}
                            alt="About Preview"
                            style={{
                                width: "100%",
                                marginTop: 10,
                                borderRadius: 8,
                                maxWidth: "120px",
                            }}
                        />
                    )}
                    <TextInput
                        label="Title"
                        required
                        mt="md"
                        {...form.getInputProps("about.title")}
                    />
                    <Textarea
                        label="Description"
                        minRows={5}
                        required
                        autosize
                        mt="md"
                        {...form.getInputProps("about.description")}
                    />
                    <TextInput
                        label="Button Text"
                        required
                        mt="md"
                        {...form.getInputProps("about.buttonText")}
                    />

                    {/* 🔶 Subsections */}
                    <Title order={4} mt="xl" mb="sm">
                        Sections (Fragrant, Discover, Story)
                    </Title>

                    <SimpleGrid cols={3} spacing="lg">
                        {sections.map((section) => (
                            <Card key={section.key} p="md" shadow="xs" radius="md" withBorder>
                                <Title order={5} mb="sm">
                                    {section.label}
                                </Title>
                                <FileInput
                                    label="Image"
                                    placeholder="Upload image"
                                    onChange={(file) =>
                                        handleUpload(file, `${section.key}.image`)
                                    }
                                    rightSection={
                                        uploadingFields[`${section.key}.image`] ? (
                                            <Loader size="xs" />
                                        ) : null
                                    }
                                />
                                {form.values[section.key]?.image && (
                                    <img
                                        src={form.values[section.key].image}
                                        alt={`${section.label} Preview`}
                                        style={{
                                            width: "100%",
                                            marginTop: 10,
                                            borderRadius: 8,
                                            maxWidth: "120px",
                                        }}
                                    />
                                )}
                                <TextInput
                                    label="Title"
                                    required
                                    mt="md"
                                    {...form.getInputProps(`${section.key}.title`)}
                                />
                                <Textarea
                                    label="Description"
                                    minRows={4}
                                    autosize
                                    required
                                    mt="md"
                                    {...form.getInputProps(`${section.key}.description`)}
                                />
                            </Card>
                        ))}
                    </SimpleGrid>

                    <Group position="right" mt="xl">
                        <Button type="submit" loading={updating}>
                            Update
                        </Button>
                    </Group>
                </form>
            </Card>
        </Container>
    );
}
