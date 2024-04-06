import { ProtectedRoute } from "@/ProtectedRoute/ProtectedRoute";
import Layout from "@/layout/Layout";


export default function Home() {
  return (
    <ProtectedRoute>
      <Layout>
      <div className="min-h-[90vh}] flex justify-center items-center bg-custombg bg-cover">
        <div>
          <h1 className="text-gray-900 text-7xl font-extrabold ">Welcome to home page</h1>
        </div>
      </div>
      </Layout>
    </ProtectedRoute>
  )
}
