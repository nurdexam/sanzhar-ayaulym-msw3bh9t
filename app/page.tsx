import EconomyInvitation from "@/components/invitation/economy/EconomyInvitation";
import type { InvitationData } from "@/types/invitation";
import invitation from "@/public/data/invitation.json";

export default function Home() {
  return <EconomyInvitation data={invitation as InvitationData} />;
}

