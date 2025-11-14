import { useState } from "react"
import { Settings, User, Bell, Shield, Database, Palette, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function SettingsPage() {
    const [settings, setSettings] = useState({
        profile: {
            name: "John Doe",
            email: "john.doe@company.com",
            role: "Data Analyst"
        },
        notifications: {
            emailNotifications: true,
            pushNotifications: false,
            reportGeneration: true,
            systemUpdates: false
        },
        data: {
            autoSave: true,
            compressionLevel: "medium",
            backupFrequency: "daily",
            retentionPeriod: "30 days"
        },
        interface: {
            theme: "system",
            language: "english",
            dateFormat: "MM/DD/YYYY",
            timezone: "UTC-5 (EST)"
        }
    })

    const handleInputChange = (section: string, field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section as keyof typeof prev],
                [field]: value
            }
        }))
    }

    const handleToggle = (section: string, field: string) => {
        setSettings(prev => {
            const currentSection = prev[section as keyof typeof prev] as any
            return {
                ...prev,
                [section]: {
                    ...currentSection,
                    [field]: !currentSection[field]
                }
            }
        })
    }

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-6">
                <Settings className="h-6 w-6 text-foreground" />
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            </div>

            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Profile Settings</span>
                    </CardTitle>
                    <CardDescription>Manage your account information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={settings.profile.name}
                                onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={settings.profile.email}
                                onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input
                                id="role"
                                value={settings.profile.role}
                                onChange={(e) => handleInputChange('profile', 'role', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex space-x-2 pt-4">
                        <Button>Save Changes</Button>
                        <Button variant="outline">Change Password</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Bell className="h-5 w-5" />
                        <span>Notification Settings</span>
                    </CardTitle>
                    <CardDescription>Configure how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-medium">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {key === 'emailNotifications' && 'Receive notifications via email'}
                                    {key === 'pushNotifications' && 'Browser push notifications'}
                                    {key === 'reportGeneration' && 'Alerts when reports are ready'}
                                    {key === 'systemUpdates' && 'System maintenance and updates'}
                                </p>
                            </div>
                            <Button
                                variant={value ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleToggle('notifications', key)}
                            >
                                {value ? 'Enabled' : 'Disabled'}
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Database className="h-5 w-5" />
                        <span>Data Management</span>
                    </CardTitle>
                    <CardDescription>Configure data storage and backup preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Auto-save</Label>
                            <Button
                                variant={settings.data.autoSave ? "default" : "outline"}
                                onClick={() => handleToggle('data', 'autoSave')}
                                className="w-full justify-start"
                            >
                                {settings.data.autoSave ? 'Enabled' : 'Disabled'}
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <Label>Compression Level</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start">
                                        {settings.data.compressionLevel.charAt(0).toUpperCase() + settings.data.compressionLevel.slice(1)}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleInputChange('data', 'compressionLevel', 'low')}>
                                        Low
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInputChange('data', 'compressionLevel', 'medium')}>
                                        Medium
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInputChange('data', 'compressionLevel', 'high')}>
                                        High
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="space-y-2">
                            <Label>Backup Frequency</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start">
                                        {settings.data.backupFrequency.charAt(0).toUpperCase() + settings.data.backupFrequency.slice(1)}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleInputChange('data', 'backupFrequency', 'hourly')}>
                                        Hourly
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInputChange('data', 'backupFrequency', 'daily')}>
                                        Daily
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInputChange('data', 'backupFrequency', 'weekly')}>
                                        Weekly
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="space-y-2">
                            <Label>Data Retention</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start">
                                        {settings.data.retentionPeriod}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleInputChange('data', 'retentionPeriod', '7 days')}>
                                        7 days
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInputChange('data', 'retentionPeriod', '30 days')}>
                                        30 days
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInputChange('data', 'retentionPeriod', '90 days')}>
                                        90 days
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInputChange('data', 'retentionPeriod', '1 year')}>
                                        1 year
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="flex space-x-2 pt-4">
                        <Button>
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                        </Button>
                        <Button variant="outline">Clear Cache</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Interface Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Palette className="h-5 w-5" />
                        <span>Interface Settings</span>
                    </CardTitle>
                    <CardDescription>Customize the appearance and behavior of the application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Theme</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start">
                                        {settings.interface.theme.charAt(0).toUpperCase() + settings.interface.theme.slice(1)}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleInputChange('interface', 'theme', 'light')}>
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInputChange('interface', 'theme', 'dark')}>
                                        Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInputChange('interface', 'theme', 'system')}>
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="space-y-2">
                            <Label>Language</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start">
                                        {settings.interface.language.charAt(0).toUpperCase() + settings.interface.language.slice(1)}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleInputChange('interface', 'language', 'english')}>
                                        English
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInputChange('interface', 'language', 'spanish')}>
                                        Spanish
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInputChange('interface', 'language', 'french')}>
                                        French
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="space-y-2">
                            <Label>Date Format</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start">
                                        {settings.interface.dateFormat}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleInputChange('interface', 'dateFormat', 'MM/DD/YYYY')}>
                                        MM/DD/YYYY
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInputChange('interface', 'dateFormat', 'DD/MM/YYYY')}>
                                        DD/MM/YYYY
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInputChange('interface', 'dateFormat', 'YYYY-MM-DD')}>
                                        YYYY-MM-DD
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="space-y-2">
                            <Label>Timezone</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start">
                                        {settings.interface.timezone}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleInputChange('interface', 'timezone', 'UTC-8 (PST)')}>
                                        UTC-8 (PST)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInputChange('interface', 'timezone', 'UTC-5 (EST)')}>
                                        UTC-5 (EST)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInputChange('interface', 'timezone', 'UTC+0 (GMT)')}>
                                        UTC+0 (GMT)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInputChange('interface', 'timezone', 'UTC+1 (CET)')}>
                                        UTC+1 (CET)
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5" />
                        <span>Security Settings</span>
                    </CardTitle>
                    <CardDescription>Manage security preferences and access controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                            </div>
                            <Button variant="outline" size="sm">Configure</Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-medium">Session Timeout</Label>
                                <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">30 minutes</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>15 minutes</DropdownMenuItem>
                                    <DropdownMenuItem>30 minutes</DropdownMenuItem>
                                    <DropdownMenuItem>1 hour</DropdownMenuItem>
                                    <DropdownMenuItem>4 hours</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-medium">Activity Log</Label>
                                <p className="text-sm text-muted-foreground">View your recent account activity</p>
                            </div>
                            <Button variant="outline" size="sm">View Log</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Save Settings */}
            <div className="flex justify-end space-x-2 pt-6">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Save All Settings</Button>
            </div>
        </div>
    )
}