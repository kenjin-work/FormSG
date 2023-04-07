import { NavigationPrompt } from '~templates/NavigationPrompt'

import {
  isDirtySelector,
  useDirtyFieldStore,
} from './builder-and-design/useDirtyFieldStore'

const CreatePageNavigationPrompt = () => {
  const isDirty = useDirtyFieldStore(isDirtySelector)
  return <NavigationPrompt when={isDirty} />
}
export default CreatePageNavigationPrompt
