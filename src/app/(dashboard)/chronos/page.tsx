import { ChronosModule } from "@/components/modules/Chronos";

export default function ChronosPage() {
  return (
    <ChronosModule
      birthDate="2005-04-20"
      lifespanYears={80}
      cleanDays={13}
    />
  );
}
