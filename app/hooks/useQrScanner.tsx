import QrScanner from "qr-scanner"
import { useEffect, useRef, useState } from "react"

type UseQrScannerProps = {
    onScanned: (scanned: string) => void
}

export function useQrScanner({ onScanned }: UseQrScannerProps) {
    const videoRef = useRef<HTMLVideoElement>()
    const [qrScanner, setQrScanner] = useState<QrScanner | undefined>(undefined)
    const [isScanning, setIsScanning] = useState(false)

    useEffect(() => {
        if (!videoRef.current) return;

        const qrScanner = new QrScanner(
            videoRef.current,
            result => {
                // Annoying hack: these highlights are getting stuck after scanning for some reason
                document.querySelectorAll('.scan-region-highlight').forEach(e => (e as HTMLElement).style.display = 'none');
                qrScanner.stop();
                setIsScanning(false);
                onScanned(result.data);
            },
            {
                returnDetailedScanResult: true,
                highlightCodeOutline: true,
                highlightScanRegion: true,
            },
        );

        setQrScanner(qrScanner)
    }, [])

    async function startScanning() {
        if (!qrScanner) return;
        await qrScanner.start();
        document.querySelectorAll('.scan-region-highlight').forEach(e => (e as HTMLElement).style.display = 'block');
        setIsScanning(true);
    }

    function cancelScanning() {
        if (!qrScanner) return;
        document.querySelectorAll('.scan-region-highlight').forEach(e => (e as HTMLElement).style.display = 'none');
        qrScanner.stop();
        setIsScanning(false);
        onScanned('');
    }

    return {
        isScanning,
        startScanning,
        cancelScanning,
        videoRef
    }
}