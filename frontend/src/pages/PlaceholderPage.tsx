import { FileText } from "lucide-react"

interface PlaceholderPageProps {
    title: string
    icon?: React.ComponentType<{ className?: string }>
}

export function PlaceholderPage({ title, icon: IconComponent = FileText }: PlaceholderPageProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <div className="bg-card rounded-lg border border-border p-8 text-center">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-card-foreground mb-2">
                    {title} Page
                </h3>
                <p className="text-muted-foreground">
                    This page is under construction. Content will be added soon.
                </p>
            </div>
        </div>
    )
}