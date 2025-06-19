import RightSidebar from "@/components/common/sidebar/RightSidebar";
import MainSection from "../_components/MainSection";

export default function Page(){
    return <div className="flex justify-around"> 
        <div className="w-3/4 bg-red-700 min-h-screen">
            <MainSection />
        </div>
        <div className="w-1/4 hidden lg:inline">
            <RightSidebar />
        </div>
    </div>
}
