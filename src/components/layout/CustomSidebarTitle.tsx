"use client";

import React from "react";
import Link from "next/link";
import { Group, Image, Text } from "@mantine/core";

export const CustomTitle: React.FC = () => {
    return (
        <Link href="/" passHref>
            <Group spacing="xs" p="md" style={{ textDecoration: "none" }}>
                <Image src="/octarine-logo.svg" alt="Logo" width={'100%'} height={35} />
            </Group>
        </Link>
    );
};
