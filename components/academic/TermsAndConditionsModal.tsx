"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TermsAndConditionsModalProps {
  open: boolean;
  onClose: () => void;
}

export function TermsAndConditionsModal({
  open,
  onClose,
}: TermsAndConditionsModalProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto text-sm text-gray-700">
          {/* General Terms */}
          <p>
            Welcome to our academic platform. By submitting your program, you
            agree to comply with all applicable laws, policies, and accuracy
            standards. Your listing must not contain false, misleading, or
            deceptive information.
          </p>
          <p>
            Data submitted is subject to review, and may be removed if found
            inappropriate or misleading. You are responsible for keeping the
            data up-to-date.
          </p>
          <p>
            For any concerns or disputes, contact our support team at
            support@gradabroad.net.
          </p>

          {/* University Offer Letter Policy — English */}
          <h3 className="font-semibold text-base mt-4">
            University Offer Letter — Communication Policy
          </h3>
          <p className="italic">
            (For Universities using gradabroad.net platform)
          </p>
          <p>
            <strong>Clause: Exclusive Communication via gradabroad.net</strong>
          </p>
          <p>
            By registering on and using the gradabroad.net platform, the
            university agrees to the following:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              The university shall only communicate with students who apply
              through the gradabroad.net platform via the platform itself.
            </li>
            <li>
              The university shall not use any external communication channels
              (e.g., personal email, phone, or other websites) to contact or
              respond to these students outside the platform.
            </li>
            <li>
              If a student attempts to contact the university via other means
              (e.g., email or messenger apps), the university must politely
              redirect the student to communicate only through gradabroad.net,
              explaining that all official correspondence is handled through the
              platform.
            </li>
          </ul>
          <p>
            This policy ensures transparency, accountability, and data
            protection in all admission-related interactions.
          </p>
          <p>
            By accepting this offer, the university confirms its commitment to
            the above communication protocol.
          </p>

          {/* Korean Version */}
          <h3 className="font-semibold text-base mt-4">
            대학용 오퍼서 — 커뮤니케이션 정책
          </h3>
          <p className="italic">
            (gradabroad.net 플랫폼을 이용하는 대학을 위한)
          </p>
          <p>
            <strong>조항: gradabroad.net을 통한 전용 소통 원칙</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              gradabroad.net 플랫폼에 등록하고 사용하는 것으로, 대학은 다음
              사항에 동의합니다:
            </li>
            <li>
              대학은 gradabroad.net 플랫폼을 통해 지원한 학생들과의 모든 소통을
              해당 플랫폼을 통해서만 진행해야 합니다.
            </li>
            <li>
              대학은 이 학생들과 <strong>외부 채널</strong>(예: 개인 이메일,
              전화, 타 웹사이트 등)을 통해 연락하거나 응답해서는 안 됩니다.
            </li>
            <li>
              학생이 외부 채널(예: 이메일, 메신저 앱 등)을 통해 대학에
              개별적으로 연락을 시도한 경우, 대학은 학생에게 공식적인 모든
              소통은 gradabroad.net을 통해 이루어진다는 점을 안내하고 플랫폼을
              통해 다시 소통할 것을 정중하게 요청해야 합니다.
            </li>
          </ul>
          <p>
            이 정책은 입학 절차의 투명성, 책임성 및 개인정보 보호를 보장하기
            위해 마련되었습니다.
          </p>
          <p>
            본 오퍼에 동의함으로써 대학은 위의 소통 정책을 성실히 이행할 것임을
            확인합니다.
          </p>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={onClose}
            className="bg-purple-900 hover:bg-purple-800"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

