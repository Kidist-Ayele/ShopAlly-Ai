"use client";

import { DarkModeProvider } from "@/app/components/saved-items/DarkModeContext";
import SavedItemsLayout from "../../components/saved-items/SavedItemsLayout";
import SavedItemsContent from "../../components/saved-items/SavedItemsContent";

export default function SavedItemsPage() {
  return (
    <DarkModeProvider>
      <SavedItemsLayout>
        <SavedItemsContent />
      </SavedItemsLayout>
    </DarkModeProvider>
  );
}
