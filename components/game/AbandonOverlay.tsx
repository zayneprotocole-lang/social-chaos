import { Button } from '@/components/ui/button'

interface AbandonOverlayProps {
    isOpen: boolean
    onCancel: () => void
    onConfirm: () => void
}

export default function AbandonOverlay({ isOpen, onCancel, onConfirm }: AbandonOverlayProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-card border-2 border-red-500 rounded-xl p-6 max-w-sm w-full shadow-[0_0_30px_rgba(239,68,68,0.3)] text-center space-y-6">
                <h3 className="text-2xl font-black text-white uppercase">Abandonner ?</h3>
                <p className="text-muted-foreground">
                    Vous êtes sur le point d'abandonner ce défi. La sentence sera immédiate.
                </p>
                <div className="flex gap-4">
                    <Button
                        onClick={onCancel}
                        variant="outline"
                        className="flex-1 font-bold"
                    >
                        NON
                    </Button>
                    <Button
                        onClick={onConfirm}
                        variant="destructive"
                        className="flex-1 font-bold shadow-[0_0_15px_var(--destructive)]"
                    >
                        OUI
                    </Button>
                </div>
            </div>
        </div>
    )
}
