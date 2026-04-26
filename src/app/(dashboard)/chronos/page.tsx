import { ChronosModule } from "@/components/modules/Chronos";

export default function ChronosPage() {
  return (
    <ChronosModule
      birthDate="2004-10-28"
      lifespanYears={80}
      cleanDays={13}
    />
  );
}
