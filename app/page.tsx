'use client'

import { Anchor, AppShell, Center, Container, Group, Image, Stack, Text, TextInput } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { useDebounce } from 'use-debounce';

export default function Home() {
  let [origin, setOrigin] = useState('');
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const [label, setLabel] = useState('')
  const [toEncode, setToEncode] = useState('')
  const active = label.length > 0 && toEncode.length > 0;
  const generateUrl = `generate?label=${encodeURIComponent(label)}&toEncode=${encodeURIComponent(toEncode)}`;
  const fullUrl = `${origin}/${generateUrl}`;
  // Debounce the QR URL so the image doesn't update as you type
  const [qrUrl] = useDebounce(fullUrl, 1000);

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
              <a href={`./${generateUrl}`}>
                <Image src='./apple-wallet-button.svg' w={120} />
              </a>
            ) : (
              <Image src='./apple-wallet-button.svg' w={120} style={{ opacity: 0.1 }} />
            )}

            {active ? (
              <Stack gap='sm'>
                <Text>Or scan with your phone</Text>
                <QRCodeSVG value={qrUrl} size={250} includeMargin style={{ borderRadius: 8 }} />
              </Stack>
            ) : null}
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
