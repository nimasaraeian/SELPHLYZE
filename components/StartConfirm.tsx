"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SupportedLanguage } from "@/utils/multilingual";

type StartConfirmProps = {
  open: boolean;
  language: SupportedLanguage;
  onConfirm: () => void;
  onCancel: () => void;
};

const TEXTS: Record<SupportedLanguage, { title: string; body: string; confirm: string; cancel: string }> = {
  en: { title: "Ready to begin?", body: "You're about to start. Answer calmly and honestly. Are you ready?", confirm: "Start", cancel: "Cancel" },
  fa: { title: "آماده‌ای شروع کنیم؟", body: "در آستانه شروع هستید. با آرامش و صادقانه پاسخ دهید. آماده‌اید؟", confirm: "شروع", cancel: "انصراف" },
  ar: { title: "هل أنت مستعد للبدء؟", body: "أنت على وشك البدء. أجب بهدوء وبصدق. هل أنت مستعد؟", confirm: "ابدأ", cancel: "إلغاء" },
  tr: { title: "Başlamaya hazır mısınız?", body: "Başlamak üzeresiniz. Sakin ve dürüst cevap verin. Hazır mısınız?", confirm: "Başla", cancel: "İptal" },
  es: { title: "¿Listo para comenzar?", body: "Estás a punto de empezar. Responde con calma y honestidad. ¿Estás listo?", confirm: "Empezar", cancel: "Cancelar" },
  fr: { title: "Prêt à commencer ?", body: "Vous êtes sur le point de commencer. Répondez calmement et honnêtement. Prêt ?", confirm: "Commencer", cancel: "Annuler" },
  pt: { title: "Pronto para começar?", body: "Você está prestes a começar. Responda com calma e honestidade. Está pronto?", confirm: "Começar", cancel: "Cancelar" },
  ru: { title: "Готовы начать?", body: "Вы собираетесь начать. Отвечайте спокойно и честно. Готовы?", confirm: "Начать", cancel: "Отмена" },
  zh: { title: "准备开始了吗？", body: "您即将开始。请冷静且诚实地作答。准备好了吗？", confirm: "开始", cancel: "取消" },
  ja: { title: "始める準備はできましたか？", body: "もうすぐ開始します。落ち着いて正直に答えてください。準備はいいですか？", confirm: "開始", cancel: "キャンセル" },
  ko: { title: "시작할 준비가 되었나요?", body: "곧 시작합니다. 침착하고 솔직하게 답변하세요. 준비되셨나요?", confirm: "시작", cancel: "취소" },
  hi: { title: "क्या आप शुरू करने के लिए तैयार हैं?", body: "आप शुरू करने वाले हैं। शांत और ईमानदारी से उत्तर दें। क्या आप तैयार हैं?", confirm: "शुरू करें", cancel: "रद्द करें" },
};

export default function StartConfirm({ open, language, onConfirm, onCancel }: StartConfirmProps) {
  const t = TEXTS[language] || TEXTS.en;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-6 text-white">
              <h3 className="text-lg font-bold">{t.title}</h3>
            </div>
            <div className="p-6 text-gray-800">
              <p className="mb-6 leading-relaxed">{t.body}</p>
              <div className="flex items-center justify-end gap-3">
                <button onClick={onCancel} className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300">
                  {t.cancel}
                </button>
                <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 shadow">
                  {t.confirm}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



