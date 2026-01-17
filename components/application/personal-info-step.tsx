"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const personalInfoSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  country_of_residence: z.string().min(1, "Country is required"),
  address: z.string().min(1, "Address is required"),
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoStepProps {
  data: Partial<PersonalInfoData>;
  onNext: (data: PersonalInfoData) => void;
  onCancel: () => void;
}

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bangladesh", "Belarus",
  "Belgium", "Brazil", "Bulgaria", "Cambodia", "Cameroon", "Canada", "Chile",
  "China", "Colombia", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark",
  "Egypt", "Estonia", "Ethiopia", "Finland", "France", "Georgia", "Germany",
  "Ghana", "Greece", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Japan", "Jordan", "Kazakhstan", "Kenya",
  "Kuwait", "Kyrgyzstan", "Latvia", "Lebanon", "Lithuania", "Luxembourg",
  "Malaysia", "Mexico", "Moldova", "Mongolia", "Morocco", "Nepal", "Netherlands",
  "New Zealand", "Nigeria", "North Korea", "Norway", "Pakistan", "Palestine",
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Saudi Arabia", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa",
  "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Tunisia", "Turkey",
  "Turkmenistan", "UAE", "Uganda", "UK", "Ukraine", "USA", "Uzbekistan",
  "Venezuela", "Vietnam", "Yemen", "Zimbabwe"
];

export function PersonalInfoStep({
  data,
  onNext,
  onCancel,
}: PersonalInfoStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data,
  });

  const nationality = watch("nationality");
  const countryOfResidence = watch("country_of_residence");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            {...register("first_name")}
            placeholder="Enter your first name"
          />
          {errors.first_name && (
            <p className="text-sm text-red-500">{errors.first_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            {...register("last_name")}
            placeholder="Enter your last name"
          />
          {errors.last_name && (
            <p className="text-sm text-red-500">{errors.last_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="+1 234 567 8900"
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth *</Label>
          <Input
            id="date_of_birth"
            type="date"
            {...register("date_of_birth")}
          />
          {errors.date_of_birth && (
            <p className="text-sm text-red-500">{errors.date_of_birth.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality *</Label>
          <Select
            value={nationality}
            onValueChange={(value) => setValue("nationality", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your nationality" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.nationality && (
            <p className="text-sm text-red-500">{errors.nationality.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country_of_residence">Country of Residence *</Label>
          <Select
            value={countryOfResidence}
            onValueChange={(value) => setValue("country_of_residence", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country_of_residence && (
            <p className="text-sm text-red-500">{errors.country_of_residence.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Full Address *</Label>
        <Textarea
          id="address"
          {...register("address")}
          placeholder="Enter your full address"
          rows={3}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
}
