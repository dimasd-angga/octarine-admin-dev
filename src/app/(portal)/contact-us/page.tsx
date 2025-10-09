"use client";

import { useForm } from "@refinedev/mantine";
import { SaveButton } from "@refinedev/mantine";
import {
    TextInput,
    Textarea,
    FileInput,
    Container,
    Title,
    Card,
    Group,
} from "@mantine/core";

export default function ContactEdit() {
    return (
        <Container size="lg" mt="xl">
            <Card shadow="sm" p="xl" radius="md" withBorder>
                <Title order={2} mb="lg">
                    Edit Contact Us Page
                </Title>

                <form>
                    {/* Hero Section */}
                    <Title order={4} mb="sm">
                        Hero Section
                    </Title>
                    <FileInput
                        label="Hero Background Image"
                        className="form-group"
                        required
                    />
                    <TextInput
                        label="Hero Title"
                        className="form-group"
                        required
                    />
                    <Textarea
                        label="Hero Subtitle"
                        className="form-group"
                        minRows={3}
                        autosize
                        required
                    />

                    {/* Contact Information */}
                    <Title order={4} mt="xl" mb="sm">
                        Contact Information
                    </Title>
                    <Textarea
                        label="Address"
                        className="form-group"
                        minRows={3}
                        autosize
                        required
                    />
                    <TextInput
                        label="Phone"
                        required
                        className="form-group"
                    />
                    <TextInput
                        label="Email"
                        required
                        className="form-group"
                    />

                    {/* Social Media Links */}
                    <Title order={4} mt="xl" mb="sm">
                        Social Media
                    </Title>
                    <TextInput
                        label="Facebook"
                        className="form-group"
                    />
                    <TextInput
                        label="Instagram"
                        className="form-group"
                    />
                    <TextInput
                        label="LinkedIn"
                        className="form-group"
                    />

                    {/* Map */}
                    <Title order={4} mt="xl" mb="sm">
                        Map
                    </Title>
                    <TextInput
                        label="Google Maps Embed URL"
                        className="form-group"
                    />

                    <Group position="right" mt="xl">
                        <SaveButton>
                            Update
                        </SaveButton>
                    </Group>
                </form>
            </Card>
        </Container>
    );
}
