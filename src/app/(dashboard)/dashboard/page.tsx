import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import {
    Package,
    AlertTriangle,
    Clock,
    IndianRupee,
    ArrowRight,
    ArrowUpRight,
    TrendingUp,
    MoreHorizontal,
    CloudRain,
    Sun,
    Thermometer
} from "lucide-react"
import Link from "next/link"
import dbConnect from "@/lib/db"
import Product from "@/models/Product"

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    await dbConnect();

    // 1. Total Products Count
    const totalProducts = await Product.countDocuments();

    // 2. Low Stock Alerts
    const lowStockItems = await Product.find({ currentStock: { $lt: 10, $gt: 0 } }).lean();
    const outOfStockItems = await Product.find({ currentStock: 0 }).lean();

    // 3. Total Stock Value
    const allProducts = await Product.find({}).lean();
    const totalStockValue = allProducts.reduce((sum, item: { currentStock: number, price: number }) => sum + (item.currentStock * item.price), 0);

    // 4. Added recently (last 30 days stock in/out)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newItemsAdded = await Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    const lowStockCount = lowStockItems.length + outOfStockItems.length;

    // 5. Weather Prediction & Insights
    let currentTemp = null;
    let weatherInsight = "Pleasant weather in Hyderabad. Maintain normal stocking patterns.";
    let WeatherIcon = Sun;

    try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=17.385&longitude=78.4867&current=temperature_2m,precipitation&timezone=auto", { next: { revalidate: 3600 } });
        if (res.ok) {
            const weatherData = await res.json();
            currentTemp = weatherData?.current?.temperature_2m;
            const currentPrecip = weatherData?.current?.precipitation;

            if (currentPrecip && currentPrecip > 0) {
                weatherInsight = "It's raining in Hyderabad. Consider stocking up on umbrellas, raincoats, and hot snacks.";
                WeatherIcon = CloudRain;
            } else if (currentTemp && currentTemp > 30) {
                weatherInsight = "It's hot outside! Recommend increasing stock of cold drinks, ice creams, and hydration drinks.";
                WeatherIcon = Sun;
            } else if (currentTemp && currentTemp < 20) {
                weatherInsight = "It's quite cool currently. Great time to stock up on hot beverages and winter snacks.";
                WeatherIcon = Thermometer;
            } else {
                WeatherIcon = Sun;
            }
        }
    } catch (e) {
        console.error("Failed to fetch weather", e);
    }

    // 5. Recent Alerts formatted for Dashboard
    const alerts = [
        ...outOfStockItems.map((item: { _id: any, name: string, currentStock: number, icon?: string }) => ({
            id: item._id.toString(),
            title: item.name,
            stock: `${item.currentStock} units left`,
            icon: item.icon || '📦',
            tag: 'Critical'
        })),
        ...lowStockItems.map((item: { _id: any, name: string, currentStock: number, icon?: string }) => ({
            id: item._id.toString(),
            title: item.name,
            stock: `${item.currentStock} units left`,
            icon: item.icon || '📦',
            tag: 'Warning'
        }))
    ].slice(0, 5);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview</h1>
                    <p className="text-muted-foreground mt-1">Manage your store inventory and alerts.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-full">Export Report</Button>
                    <Link href="/stock-in">
                        <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                            + Add Stock
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid - Visual match to Reference (Clean, white cards, minimalist) */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-2xl border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Stock Value</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                            <IndianRupee className="h-4 w-4 text-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mt-2">₹{totalStockValue.toLocaleString('en-IN')}</div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl bg-foreground text-background border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white/70">Total Products</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                            <Package className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mt-2 text-white">{totalProducts}</div>
                        <div className="flex items-center text-xs text-white/60 mt-1">
                            <span className="text-white font-medium flex items-center mr-1">
                                +{newItemsAdded}
                            </span>
                            new items added recently
                        </div>
                    </CardContent>
                </Card>


                <Card className="rounded-2xl border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alerts</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mt-2 text-foreground">{lowStockCount}</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <span>Refill recommended</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area - Grid Layout like Reference */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column: List/Table style (Using Cards for visual rhythm) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight text-foreground">Low Stock Alerts</h2>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">View All</Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {alerts.length === 0 ? (
                            <div className="p-5 text-muted-foreground border rounded-xl bg-card">No alerts! Inventory is healthy.</div>
                        ) : alerts.map((item, i) => (
                            <Card key={i} className="rounded-xl border shadow-sm">
                                <div className="p-5 flex flex-col h-full justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-10 w-10 text-2xl flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-base mb-1">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-3">{item.stock}</p>
                                        <Badge variant={item.tag === 'Critical' ? 'destructive' : 'warning'} className="rounded-md font-normal px-2.5">
                                            {item.tag}
                                        </Badge>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Right Column: Quick Actions / Smaller widgets */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight text-foreground">Hyderabad Weather Insights</h2>
                    </div>

                    <Card className="rounded-2xl border-none shadow-sm ring-1 ring-border/50">
                        <CardHeader className="pb-2">
                            <div className="flex items-center space-x-2">
                                {WeatherIcon && <WeatherIcon className="h-5 w-5 text-blue-500" />}
                                <CardTitle className="text-lg font-medium">Local Forecast</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mt-1 text-foreground">
                                {currentTemp ? `${currentTemp}°C` : '--°C'}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                {weatherInsight}
                            </p>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight text-foreground">Quick Actions</h2>
                    </div>

                    <Card className="rounded-2xl border-none shadow-sm ring-1 ring-border/50 p-1">
                        <div className="grid gap-1">
                            <Link href="/stock-in">
                                <div className="flex items-center p-4 hover:bg-secondary rounded-xl transition-colors cursor-pointer group">
                                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4 group-hover:bg-emerald-200 transition-colors">
                                        <ArrowUpRight className="h-5 w-5 text-emerald-700" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">Stock In</h4>
                                        <p className="text-xs text-muted-foreground">Add new purchases</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </Link>
                            <Link href="/stock-out">
                                <div className="flex items-center p-4 hover:bg-secondary rounded-xl transition-colors cursor-pointer group">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                                        <TrendingUp className="h-5 w-5 text-blue-700" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">Stock Out</h4>
                                        <p className="text-xs text-muted-foreground">Record a sale</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </Link>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    )
}
