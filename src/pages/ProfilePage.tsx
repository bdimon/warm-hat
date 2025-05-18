// pages/account.tsx (или /profile)
// import  ProfileForm  from "@/components/ProfileForm";
import AuthSettingsForm from "@/components/AuthSettingsForm";

export default function AccountPage() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Профиль</h1>
      {/* <ProfileForm /> */}
      <AuthSettingsForm />
    </div>
  );
}
