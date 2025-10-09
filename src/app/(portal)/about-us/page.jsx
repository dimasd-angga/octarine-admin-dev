"use client";

import { useState } from "react";
import { useForm, SaveButton } from "@refinedev/mantine";
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
} from "@mantine/core";
import { useCreate } from "@refinedev/core";

export default function AboutEdit() {
    const sections = [
        { key: "fragrant", label: "Fragrant" },
        { key: "discover", label: "Discover" },
        { key: "story", label: "Story" },
    ];

    const {
        getInputProps,
        saveButtonProps,
        formLoading,
        values,
        setFieldValue,
    } = useForm({
        resource: "about-us",
        action: "edit",
    });

    // useCreate for file upload
    const { mutate: create, isPending: uploading } = useCreate();

    const handleUpload = (file, field) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        create(
            {
                resource: "pages/about-us/upload",
                values: formData,
            },
            {
                onSuccess: (data) => {
                    setFieldValue(field, data?.data?.url);
                },
                onError: (err) => {
                    console.error("Upload failed:", err);
                },
            }
        );
    };

    return (
        <Container size="lg" mt="xl">
            <Card shadow="sm" p="xl" radius="md" withBorder>
                <Title order={2} mb="lg">
                    Edit About Us Page
                </Title>

                <form>
                    {/* Hero Section */}
                    <Title order={4} mb="sm">
                        Hero Section
                    </Title>
                    <FileInput
                        label="Hero Background Image"
                        placeholder="Upload hero image"
                        className="form-group"
                        required
                        onChange={(file) => handleUpload(file, "heroImage")}
                        rightSection={uploading ? <Loader size="xs" /> : null}
                    />

                    {/* About Section */}
                    <Title order={4} mt="xl" mb="sm">
                        About Octarine Section
                    </Title>
                    <FileInput
                        label="About Image"
                        placeholder="Upload image"
                        className="form-group"
                        required
                        onChange={(file) => handleUpload(file, "about.image")}
                        rightSection={uploading ? <Loader size="xs" /> : null}
                    />
                    <TextInput
                        label="Title"
                        {...getInputProps("about.title")}
                        className="form-group"
                        required
                        defaultValue={values?.about?.title}
                    />
                    <Textarea
                        label="Description"
                        minRows={5}
                        className="form-group"
                        required
                        autosize
                        {...getInputProps("about.description")}
                        defaultValue={values?.about?.description}
                    />
                    <TextInput
                        label="Button Text"
                        className="form-group"
                        required
                        {...getInputProps("about.buttonText")}
                        defaultValue={values?.about?.buttonText}
                    />

                    {/* Subsections */}
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
                                    className="form-group"
                                    required
                                    onChange={(file) =>
                                        handleUpload(file, `${section.key}.image`)
                                    }
                                    rightSection={uploading ? <Loader size="xs" /> : null}
                                />
                                <TextInput
                                    label="Title"
                                    required
                                    className="form-group"
                                    {...getInputProps(`${section.key}.title`)}
                                    defaultValue={values?.[section.key]?.title}
                                />
                                <Textarea
                                    label="Description"
                                    minRows={4}
                                    autosize
                                    required
                                    className="form-group"
                                    {...getInputProps(`${section.key}.description`)}
                                    defaultValue={values?.[section.key]?.description}
                                />
                            </Card>
                        ))}
                    </SimpleGrid>

                    <Group position="right" mt="xl">
                        <SaveButton loading={formLoading} {...saveButtonProps}>
                            Update
                        </SaveButton>
                    </Group>
                </form>
            </Card>
        </Container>
    );
}
