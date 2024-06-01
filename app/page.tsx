'use client'

import { Anchor, AppShell, Center, Container, Group, Image, Stack, Text, TextInput } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import { useState } from "react";

export default function Home() {
  const [label, setLabel] = useState('')
  const [toEncode, setToEncode] = useState('')
  const active = label.length > 0 && toEncode.length > 0;

  return (
    <AppShell>
      <AppShell.Main>
        <Container p='xl'>
          <Stack gap='xl'>

            <form onSubmit={(e) => e.preventDefault()}>
              <TextInput label="Label" onChange={(e) => setLabel(e.currentTarget.value)} />
              <TextInput label="Data to encode" onChange={(e) => setToEncode(e.currentTarget.value)} />
            </form>

            {active ? (
              <a href={`./generate?label=${encodeURIComponent(label)}&toEncode=${encodeURIComponent(toEncode)}`}>
                <Image src='./apple-wallet-button.svg' w={120} />
              </a>
            ) : (
              <Image src='./apple-wallet-button.svg' w={120} style={{ opacity: 0.1 }} />
            )}
          </Stack>
        </Container>
      </AppShell.Main>

      <AppShell.Footer>
        <Center>
          <Anchor href='https://github.com/mcintyre94/pass-generator' underline='never' c='white'>
            <Group>
              <IconBrandGithub />
              <Text>Source on Github</Text>
            </Group>
          </Anchor>
        </Center>
      </AppShell.Footer>
    </AppShell>
  );
}
