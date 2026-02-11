"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenSquare } from "lucide-react";
import DOMPurify from "dompurify";

export default function CampusInfoPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [campusData, setCampusData] = useState({
    yearOfEstablishment: "01.01.2020",
    numberOfGraduates: "600",
    proportionOfEmployedGraduates: "350",
    rankingWithinCountry: "10",
    globalRankingPosition: "-",
    hasDormitories: true,
    dormitoryFeeRangeMin: "50",
    dormitoryFeeRangeMax: "100",
    websiteLink: "https://newuu.uz/",
    aboutUniversity: {
      english: `New Uzbekistan University (NewUU) is Uzbekistan's first comprehensive research university where research and education are integrated. Located at the heart of greater Central Asia, we are building the nation's premier institution as the country embarks to conclude its first decade of political and market economy reforms. NewUU aims to become Central Asia's flagship university through an official partnership with the Massachusetts Institute of Technology's (MIT) Jameel Abdul Latif-World Education Lab (J-WEL) and Technical University of Munich (TUM) International.

Offering a diverse range of programs, including 9 undergraduate, 2 graduate, 9 PhD and 2 DSc degrees across the schools of Engineering, Computing, Humanities, Natural & Social Sciences, and Management, the university is tailored to meet the evolving demands of the modern world. By fostering a multidisciplinary approach, NewUU is educating the next generation of leaders and innovators who will lay out the groundwork for significant contributions to the local & global knowledge economy.

Beyond its academic offerings, New Uzbekistan University is committed to becoming a local and regional hub for the dissemination of knowledge and best practices in higher education. Through organizing a variety of events such as local and regional forums, conferences, hackathons, and festivals, NewUU actively cultivates a culture of innovation, entrepreneurship, engineering, and research. This commitment to outreach and collaboration underscores NewUU's vision of contribution to the broader educational and research community in Uzbekistan and Central Asia.`,
      korean: "",
      russian: "",
      uzbek: "",
    },
  });

  const [formData, setFormData] = useState({ ...campusData });
  const [activeTab, setActiveTab] = useState("english");

  const handleEditClick = () => {
    setFormData({ ...campusData });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAboutChange = (value: string) => {
    setFormData({
      ...formData,
      aboutUniversity: {
        ...formData.aboutUniversity,
        [activeTab]: value,
      },
    });
  };

  const handleSave = () => {
    setCampusData({ ...formData });
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Graduate in Korea</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src="/placeholder.svg?height=40&width=40"
            alt="US Flag"
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 p-4 bg-gray-50 min-h-[calc(100vh-64px)]">
          <nav className="space-y-2">
            <div className="p-3 rounded-md flex items-center gap-3 hover:bg-gray-100 cursor-pointer">
              <div className="bg-purple-800 text-white p-1 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className="text-gray-600">Profile</span>
            </div>

            <div className="bg-purple-100 p-3 rounded-md flex items-center gap-3">
              <div className="bg-purple-800 text-white p-1 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <span className="font-medium text-purple-900">
                Information about campus
              </span>
            </div>

            {[
              { icon: "graduation-cap", text: "Academic programs" },
              { icon: "award", text: "Scholarships" },
              { icon: "image", text: "Gallery" },
              { icon: "users", text: "Candidates" },
              { icon: "megaphone", text: "Sponsored content" },
              { icon: "credit-card", text: "Billing and Payments" },
              { icon: "file", text: "Document types" },
              { icon: "bar-chart", text: "Statistics" },
              { icon: "settings", text: "Settings" },
            ].map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-md flex items-center gap-3 hover:bg-gray-100 cursor-pointer"
              >
                <div className="text-gray-500 p-1 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                  </svg>
                </div>
                <span className="text-gray-600">{item.text}</span>
              </div>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 text-red-500 flex items-center gap-2 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-900">
              Information about campus
            </h2>
            <Button
              onClick={handleEditClick}
              className="bg-purple-900 hover:bg-purple-800"
            >
              <PenSquare className="mr-2 h-4 w-4" /> Edit
            </Button>
          </div>

          <Card className="mb-6 overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-4">
              <div>
                <p className="text-sm text-gray-500">Year of establishment</p>
                <p className="font-medium text-purple-900">
                  {campusData.yearOfEstablishment}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Number of graduates</p>
                <p className="font-medium">{campusData.numberOfGraduates}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Proportion of employed graduates
                </p>
                <p className="font-medium">
                  {campusData.proportionOfEmployedGraduates}
                </p>
              </div>
            </div>
          </Card>

          <Card className="mb-6 overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-4">
              <div>
                <p className="text-sm text-gray-500">
                  Ranking within the country
                </p>
                <p className="font-medium text-purple-900">
                  {campusData.rankingWithinCountry}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Global ranking position</p>
                <p className="font-medium">
                  {campusData.globalRankingPosition}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Does the university have dormitories
                </p>
                <p className="font-medium">
                  {campusData.hasDormitories ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="mb-6 overflow-hidden">
            <div className="p-4">
              <p className="text-sm text-gray-500">Dormitory fee range</p>
              <p className="font-medium">
                {campusData.dormitoryFeeRangeMin} -{" "}
                {campusData.dormitoryFeeRangeMax}
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="p-4">
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      campusData.aboutUniversity.english.replace(/\n/g, "<br/>")
                    ),
                  }}
                />
              </div>
            </div>
          </Card>
        </main>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Information about campus
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label htmlFor="yearOfEstablishment">Year of establishment</Label>
              <Input
                id="yearOfEstablishment"
                name="yearOfEstablishment"
                value={formData.yearOfEstablishment}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="numberOfGraduates">Number of graduates</Label>
              <Input
                id="numberOfGraduates"
                name="numberOfGraduates"
                value={formData.numberOfGraduates}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="proportionOfEmployedGraduates">
                Proportion of employed graduates
              </Label>
              <Input
                id="proportionOfEmployedGraduates"
                name="proportionOfEmployedGraduates"
                value={formData.proportionOfEmployedGraduates}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="rankingWithinCountry">
                Ranking within the country
              </Label>
              <Input
                id="rankingWithinCountry"
                name="rankingWithinCountry"
                value={formData.rankingWithinCountry}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="websiteLink">Website</Label>
              <Input
                id="websiteLink"
                name="websiteLink"
                value={formData.websiteLink}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="globalRankingPosition">
                Global ranking position
              </Label>
              <Input
                id="globalRankingPosition"
                name="globalRankingPosition"
                value={formData.globalRankingPosition}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="Global ranking position"
              />
            </div>

            <div>
              <Label htmlFor="websiteLink">Link</Label>
              <Input
                id="websiteLink"
                name="websiteLink"
                value={formData.websiteLink}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="https://example.com"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasDormitories"
                checked={formData.hasDormitories}
                onCheckedChange={(checked: boolean) => {
                  setFormData({ ...formData, hasDormitories: checked });
                }}
              />
              <Label htmlFor="hasDormitories">
                Does the university have dormitories
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dormitoryFeeRangeMin">
                  Dormitory fee range (min)
                </Label>
                <Input
                  id="dormitoryFeeRangeMin"
                  name="dormitoryFeeRangeMin"
                  value={formData.dormitoryFeeRangeMin}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dormitoryFeeRangeMax">
                  Dormitory fee range (max)
                </Label>
                <Input
                  id="dormitoryFeeRangeMax"
                  name="dormitoryFeeRangeMax"
                  value={formData.dormitoryFeeRangeMax}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>About the university</Label>
              <Tabs
                defaultValue="english"
                className="mt-2"
                onValueChange={setActiveTab}
              >
                <TabsList className="bg-purple-100">
                  <TabsTrigger
                    value="english"
                    className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                  >
                    English
                  </TabsTrigger>
                  <TabsTrigger
                    value="korean"
                    className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                  >
                    한국어
                  </TabsTrigger>
                  <TabsTrigger
                    value="russian"
                    className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                  >
                    Русский
                  </TabsTrigger>
                  <TabsTrigger
                    value="uzbek"
                    className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                  >
                    O'zbek
                  </TabsTrigger>
                </TabsList>
                <div className="border rounded-md mt-2 p-2">
                  <div className="flex gap-2 border-b p-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                    <select className="border rounded px-2 text-sm">
                      <option>Paragraph</option>
                      <option>Heading 1</option>
                      <option>Heading 2</option>
                    </select>
                    <button className="p-1 hover:bg-gray-100 rounded font-bold">
                      B
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded italic">
                      I
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                      </svg>
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <TabsContent value="english">
                    <textarea
                      className="w-full h-64 p-2 border-0 focus:outline-none focus:ring-0"
                      value={formData.aboutUniversity.english}
                      onChange={(e) => handleAboutChange(e.target.value)}
                    />
                  </TabsContent>
                  <TabsContent value="korean">
                    <textarea
                      className="w-full h-64 p-2 border-0 focus:outline-none focus:ring-0"
                      value={formData.aboutUniversity.korean}
                      onChange={(e) => handleAboutChange(e.target.value)}
                      placeholder="Enter Korean description"
                    />
                  </TabsContent>
                  <TabsContent value="russian">
                    <textarea
                      className="w-full h-64 p-2 border-0 focus:outline-none focus:ring-0"
                      value={formData.aboutUniversity.russian}
                      onChange={(e) => handleAboutChange(e.target.value)}
                      placeholder="Enter Russian description"
                    />
                  </TabsContent>
                  <TabsContent value="uzbek">
                    <textarea
                      className="w-full h-64 p-2 border-0 focus:outline-none focus:ring-0"
                      value={formData.aboutUniversity.uzbek}
                      onChange={(e) => handleAboutChange(e.target.value)}
                      placeholder="Enter Uzbek description"
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-purple-900 hover:bg-purple-800"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
