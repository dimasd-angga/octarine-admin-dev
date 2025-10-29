"use client";

import { useEffect, useState } from "react";
import {
    TextInput,
    Textarea,
    FileInput,
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

export default function ContactEdit() {
    const [uploadingFields, setUploadingFields] = useState({});

    // 🟢 Get Contact Us data
    const { data: contactData, isLoading: isLoadingContact } = useOne({
        resource: "pages/contact-us",
        id: null,
    });

    // 🟠 Update Contact Us
    const { mutate: updatePage, isLoading: updating } = useUpdate();

    // 🟣 Upload image
    const { mutate: uploadFile } = useCreate();

    // 🧩 Form structure
    const form = useForm({
        initialValues: {
            hero: { image: "", title: "", subtitle: "" },
            info: { address: "", phone: "", email: "", hours: "" },
            socials: { facebook: "", instagram: "", linkedin: "" },
            map: { embedUrl: "" },
        },
    });

    // Prefill values after fetch
    useEffect(() => {
        if (contactData?.data) {
            const d = contactData.data;
            form.setValues({
                hero: {
                    image: d?.hero?.image || "",
                    title: d?.hero?.title || "",
                    subtitle: d?.hero?.subtitle || "",
                },
                info: {
                    address: d?.info?.address || "",
                    phone: d?.info?.phone || "",
                    email: d?.info?.email || "",
                    hours: d?.info?.hours || "",
                },
                socials: {
                    facebook: d?.socials?.facebook || "",
                    instagram: d?.socials?.instagram || "",
                    linkedin: d?.socials?.linkedin || "",
                },
                map: {
                    embedUrl: d?.map?.embedUrl || "",
                },
            });
        }
    }, [contactData]);

    // 📤 File upload (self loader)
    const handleUpload = (file, field) => {
        if (!file) return;
        setUploadingFields((prev) => ({ ...prev, [field]: true }));

        const formData = new FormData();
        formData.append("file", file);

        uploadFile(
            {
                resource: "pages/contact-us/upload",
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
                        message: "Failed to upload image",
                        color: "red",
                    });
                },
            }
        );
    };

    // 💾 Save changes
    const handleSubmit = (values) => {
        updatePage(
            {
                resource: "pages/contact-us",
                id: null,
                values,
            },
            {
                onSuccess: () => {
                    showNotification({
                        title: "Success",
                        message: "Contact Us page updated successfully",
                        color: "green",
                    });
                },
                onError: () => {
                    showNotification({
                        title: "Error",
                        message: "Failed to update Contact Us page",
                        color: "red",
                    });
                },
            }
        );
    };

    if (isLoadingContact) {
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
                    Edit Contact Us Page
                </Title>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    {/* 🖼 Hero Section */}
                    <Title order={4} mb="sm">
                        Hero Section
                    </Title>
                    <FileInput
                        label="Hero Background Image"
                        onChange={(file) => handleUpload(file, "hero.image")}
                        rightSection={
                            uploadingFields["hero.image"] ? <Loader size="xs" /> : null
                        }
                    />
                    {form.values.hero.image && (
                        <img
                            src={form.values.hero.image}
                            alt="Hero"
                            style={{
                                width: "100%",
                                marginTop: 10,
                                borderRadius: 8,
                                maxWidth: "120px",
                            }}
                        />
                    )}
                    <TextInput
                        label="Hero Title"
                        required
                        mt="md"
                        {...form.getInputProps("hero.title")}
                    />
                    <Textarea
                        label="Hero Subtitle"
                        required
                        minRows={3}
                        autosize
                        mt="md"
                        {...form.getInputProps("hero.subtitle")}
                    />

                    {/* 🏢 Contact Information */}
                    <Title order={4} mt="xl" mb="sm">
                        Contact Information
                    </Title>
                    <Textarea
                        label="Address"
                        minRows={3}
                        autosize
                        required
                        {...form.getInputProps("info.address")}
                    />
                    <TextInput
                        label="Phone"
                        required
                        mt="md"
                        {...form.getInputProps("info.phone")}
                    />
                    <TextInput
                        label="Email"
                        required
                        mt="md"
                        {...form.getInputProps("info.email")}
                    />
                    <TextInput
                        label="Business Hours"
                        mt="md"
                        {...form.getInputProps("info.hours")}
                    />

                    {/* 🌐 Social Media */}
                    <Title order={4} mt="xl" mb="sm">
                        Social Media
                    </Title>
                    <TextInput
                        label="Facebook"
                        {...form.getInputProps("socials.facebook")}
                    />
                    <TextInput
                        label="Instagram"
                        mt="md"
                        {...form.getInputProps("socials.instagram")}
                    />
                    <TextInput
                        label="LinkedIn"
                        mt="md"
                        {...form.getInputProps("socials.linkedin")}
                    />

                    {/* 🗺 Map */}
                    <Title order={4} mt="xl" mb="sm">
                        Map
                    </Title>
                    <TextInput
                        label="Google Maps Embed URL"
                        {...form.getInputProps("map.embedUrl")}
                    />

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
