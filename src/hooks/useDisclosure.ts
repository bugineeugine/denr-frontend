import { useCallback, useState } from 'react';
type UseDisclosureProps = { defaultIsOpen?: boolean };

export type UseDisclosureType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
};
export const useDisclosure = ({ defaultIsOpen = false }: UseDisclosureProps = {}): UseDisclosureType => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);
  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen(prev => !prev), []);
  return { isOpen, onOpen, onClose, onToggle };
};
