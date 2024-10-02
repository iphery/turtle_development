import UserAuth from "@/components/auth";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function page() {
  return (
    <UserAuth>
      <DefaultLayout>product</DefaultLayout>
    </UserAuth>
  );
}
