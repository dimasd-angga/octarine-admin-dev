"use client";

import { useForm } from "@refinedev/mantine";
import { SaveButton } from "@refinedev/mantine";
import {
    TextInput,
    Container,
    Title,
    Card,
    Group,
} from "@mantine/core";
import dynamic from "next/dynamic";
import { useState } from "react";

// ReactQuill dynamic import (Next.js SSR safe)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function PrivacyEdit() {
    const [editorValue, setEditorValue] = useState("");

    return (
        <Container size="lg" mt="xl">
            <Card shadow="sm" p="xl" radius="md" withBorder>
                <Title order={2} mb="lg">
                    Edit Privacy Policy
                </Title>

                <form>
                    {/* Title */}
                    <TextInput
                        label="Page Title"
                        className="form-group"
                    />

                    {/* Content */}
                    <div className="form-group">
                        <Title order={4} mb="sm">
                            Content
                        </Title>
                        <ReactQuill
                            theme="snow"
                            value={editorValue}
                            onChange={(val) => {
                                setEditorValue(val);
                            }}
                            style={{ minHeight: "300px" }}
                        />
                    </div>

                    {/* Save Button */}
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
