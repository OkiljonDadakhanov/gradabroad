"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ServiceType } from "@/types/billing"

interface TermsAndConditionsModalProps {
  isOpen: boolean
  onClose: () => void
  serviceType: ServiceType
}

export function TermsAndConditionsModal({ isOpen, onClose, serviceType }: TermsAndConditionsModalProps) {
  // Terms content for different service types
  const getTermsContent = (type: ServiceType) => {
    switch (type) {
      case ServiceType.GOLD:
        return {
          english: (
            <div className="prose max-w-none">
              <h3>Terms of Use and Payment Conditions: Gold Plan</h3>
              <h4>1. General Provisions</h4>
              <p>
                These terms govern the use of the "gradabroad.net" platform. The platform provides services specifically
                for South Korean universities and facilitates effective collaboration with students. By using
                "gradabroad.net," you agree to these terms.
              </p>
              <h4>2. Description of Services</h4>
              <p>Through the "gradabroad.net" platform, South Korean universities can access the following services:</p>
              <ul>
                <li>Accepting and reviewing student applications.</li>
                <li>Automating and managing the university admission process.</li>
                <li>Delivering admission results to students.</li>
                <li>Right to post 2 advertisements per month.</li>
                <li>Right to upload one video up to 50 MB per month.</li>
              </ul>
              <h4>3. Payment Conditions: Gold Plan</h4>
              <ul>
                <li>The annual subscription fee for the Gold Plan is 500 USD.</li>
                <li>Payments are accepted only via bank transfers (SWIFT).</li>
                <li>An invoice will be issued after the payment is made.</li>
                <li>Payments are non-refundable.</li>
              </ul>
              <h4>4. User Responsibilities</h4>
              <ul>
                <li>Universities must use the platform lawfully and in accordance with the specified rules.</li>
                <li>Applications must be reviewed fairly, and results must be delivered promptly.</li>
                <li>Monthly advertisement and video upload limits must not be exceeded.</li>
              </ul>
              <h4>5. gradabroad.net Responsibilities</h4>
              <ul>
                <li>Ensuring the quality of services and providing technical support.</li>
                <li>
                  Keeping university data confidential and disclosing it only to the Ministries of Education of
                  Uzbekistan and South Korea.
                </li>
                <li>Allowing the posting of 2 advertisements per month.</li>
                <li>Allowing the uploading of one video per month.</li>
              </ul>
              <h4>6. Validity of Terms</h4>
              <p>These terms and conditions come into effect upon confirmation of the subscription payment.</p>
              <h4>7. Contact Information</h4>
              <p>For inquiries or issues, please contact: "gradabroad.net" Platform Email: gradabroadltd@gmail.com</p>
            </div>
          ),
          korean: (
            <div className="prose max-w-none">
              <h3>사용 약관 및 결제 조건: 골드 요금제</h3>
              <h4>1. 일반 조항</h4>
              <p>
                이 약관은 "gradabroad.net" 플랫폼의 이용 규정을 명시합니다. 본 플랫폼은 한국 대학을 위한 맞춤형 서비스를
                제공하며 학생들과 효과적인 협력을 지원합니다. "gradabroad.net"를 사용함으로써 귀하는 본 약관에 동의하는
                것으로 간주됩니다.
              </p>
              <h4>2. 서비스 설명</h4>
              <p>"gradabroad.net" 플랫폼을 통해 한국 대학은 다음 서비스를 이용할 수 있습니다:</p>
              <ul>
                <li>학생 지원서 접수 및 검토.</li>
                <li>대학 입학 절차의 자동화 및 관리.</li>
                <li>입학 결과를 학생들에게 전달.</li>
                <li>월 2회 광고 게시 권한.</li>
                <li>월 1회 최대 50 MB의 동영상 업로드 권한.</li>
              </ul>
              <h4>3. 결제 조건: 골드 요금제</h4>
              <ul>
                <li>골드 요금제의 연간 구독 요금은 500 USD입니다.</li>
                <li>결제는 은행 송금 (SWIFT)으로만 가능합니다.</li>
                <li>결제 후 청구서가 발행됩니다.</li>
                <li>결제 금액은 환불되지 않습니다.</li>
              </ul>
              <h4>4. 사용자 의무</h4>
              <ul>
                <li>대학은 플랫폼을 법적이고 명시된 규정에 따라 사용해야 합니다.</li>
                <li>지원서를 공정하게 검토하고 결과를 신속히 전달해야 합니다.</li>
                <li>월 광고 및 동영상 업로드 한도를 초과하지 않아야 합니다.</li>
              </ul>
              <h4>5. gradabroad.net의 의무</h4>
              <ul>
                <li>서비스 품질을 보장하고 기술 지원을 제공합니다.</li>
                <li>대학 데이터를 기밀로 유지하며 우즈베키스탄 및 한국 교육부에만 공개합니다.</li>
                <li>월 2회 광고 게시를 허용합니다.</li>
                <li>월 1회 동영상 업로드를 허용합니다.</li>
              </ul>
              <h4>6. 약관 유효 기간</h4>
              <p>이 약관은 구독 결제가 확인된 시점부터 발효됩니다.</p>
              <h4>7. 연락처 정보</h4>
              <p>
                문의사항이나 문제가 있을 경우 아래로 연락해 주십시오: "gradabroad.net" 플랫폼 이메일:
                gradabroadltd@gmail.com
              </p>
            </div>
          ),
        }
      case ServiceType.SILVER:
        return {
          english: (
            <div className="prose max-w-none">
              <h3>Terms of Use and Payment Conditions: Silver Plan</h3>
              <p>Silver plan terms and conditions would appear here.</p>
            </div>
          ),
          korean: (
            <div className="prose max-w-none">
              <h3>사용 약관 및 결제 조건: 실버 요금제</h3>
              <p>실버 요금제 이용약관이 여기에 표시됩니다.</p>
            </div>
          ),
        }
      default:
        return {
          english: (
            <div className="prose max-w-none">
              <h3>Terms of Use and Payment Conditions</h3>
              <p>Standard terms and conditions would appear here.</p>
            </div>
          ),
          korean: (
            <div className="prose max-w-none">
              <h3>사용 약관 및 결제 조건</h3>
              <p>표준 이용약관이 여기에 표시됩니다.</p>
            </div>
          ),
        }
    }
  }

  const termsContent = getTermsContent(serviceType)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Terms and Conditions</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="english" className="mt-4">
          <TabsList className="bg-purple-100">
            <TabsTrigger value="english" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
              English
            </TabsTrigger>
            <TabsTrigger value="korean" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
              한국어
            </TabsTrigger>
          </TabsList>
          <TabsContent value="english" className="mt-4 p-4 border rounded-md">
            {termsContent.english}
          </TabsContent>
          <TabsContent value="korean" className="mt-4 p-4 border rounded-md">
            {termsContent.korean}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} className="bg-purple-900 hover:bg-purple-800">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
