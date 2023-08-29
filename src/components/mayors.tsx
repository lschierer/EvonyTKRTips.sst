import { useState } from "react";
import {
    AppLayout,
    Button,
    Container,
    FormField,
    Header,
    Input,
    Link,
    SpaceBetween
} from "@cloudscape-design/components";

/*
 * Learn more about Cloudscape Design System at
 * https://cloudscape.design
 */
export default function GeneralTable() {
    const [value, setValue] = useState("");

    return (
        <AppLayout
            toolsHide={true}
            navigationHide={true}
            contentHeader={
                <Header
                    variant="h1"
                    description={
                        <>
                            This React app uses Cloudscape components. Learn more in{" "}
                            <Link
                                href="https://cloudscape.design"
                                external
                                externalIconAriaLabel="Opens in a new tab"
                            >
                                the official documentation.
                            </Link>
                        </>
                    }
                >
                    Hello from Cloudscape Design System
                </Header>
            }
            content={
                <Container>
                    <SpaceBetween size="s">
                        <FormField label="Start editing to see some magic happen">
                            <Input
                                value={value}
                                onChange={(event) => setValue(event.detail.value)}
                            />
                        </FormField>
                        <Button variant="primary">Click me</Button>
                    </SpaceBetween>
                </Container>
            }
        />
    );
}
