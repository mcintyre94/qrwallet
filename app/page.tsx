'use client'

import { Anchor, AppShell, Button, Center, Container, FileButton, FileInput, Flex, Group, Image, Stack, Text, TextInput } from "@mantine/core";
import { IconBrandGithub, IconFile, IconScan } from "@tabler/icons-react";
import { MutableRefObject, useEffect, useState } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { useDebounce } from 'use-debounce';
import { useQrScanner } from "./hooks/useQrScanner";

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

  const {
    isScanning,
    startScanning,
    cancelScanning,
    scanImage,
    videoRef
  } = useQrScanner({
    onScanned: (scanned: string) => {
      setToEncode(scanned);
    }
  })

  return (
    <AppShell>
      <AppShell.Main>
        <video ref={videoRef as MutableRefObject<HTMLVideoElement>} />

        <Container p='xl'>
          <Stack gap='xl'>

            <form onSubmit={(e) => e.preventDefault()}>
              <Stack gap='md'>
                {isScanning ? <Button onClick={cancelScanning} style={{ maxWidth: 'fit-content' }}>Cancel scanning</Button> : null}
                <TextInput label="Label" onChange={(e) => setLabel(e.currentTarget.value)} />
                <TextInput
                  label="Data to encode"
                  value={toEncode}
                  onChange={(e) => setToEncode(e.currentTarget.value)}
                />
                <Group gap='md'>
                  <Button leftSection={<IconScan />} onClick={startScanning}>Scan with camera</Button>
                  <FileButton accept="image/png,image/jpeg" onChange={async (e) => {
                    if (e) {
                      const result = await scanImage(e)
                      console.log({ result });
                      if (!result) alert('No QR code found in image. Try cropping the image and try again.')
                    }
                  }}>
                    {(props) => <Button leftSection={<IconFile />} {...props}>Scan from image</Button>}
                  </FileButton>
                </Group>
              </Stack>
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

      <AppShell.Footer pb={24}>
        <Center>
          <Anchor href='https://github.com/mcintyre94/qrwallet' underline='never' c='white'>
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
