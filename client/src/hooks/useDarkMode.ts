import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { toggleDarkMode } from '@/store/themeSlice';

export function useDarkMode() {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const dispatch = useDispatch();

  return {
    darkMode,
    toggleDarkMode: () => dispatch(toggleDarkMode()),
  };
}
