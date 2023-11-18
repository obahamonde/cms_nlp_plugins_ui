import { Message, DocumentRef } from "~/types";

export const useSpeech = (language: string) => {
  // Setup the speech recognition instance
  const speech = useSpeechRecognition({
    lang: language,
    continuous: true,
  });

  // Setup the speech recognition grammar
  const SpeechGrammarList =
    // @ts-ignore
    window.SpeechGrammarList || window.webkitSpeechGrammarList;
  const speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(1);
  speech.recognition!.grammars = speechRecognitionList;

  const { isListening, result } = speech;

  const fetchAudio = async (text: string) => {
    try {
      const { state } = useStore()
      if (!state.user) return;
      const { data: textData } = await useFetch(`/api/utterance?text=${text}`).text();
      if (!textData.value) return;
      const modelOutput = textData.value;
      const [setMessage, _, __, ___] = useFirestore<Message>('messages');


      const userMessage: Message = {
        role: 'user',
        content: text,
        createdAt: new Date()
      }
      state.messages.unshift({ ...userMessage, user: { name: state.user.displayName!, photoURL: state.user.photoURL!, email: state.user.email! } })
      await setMessage(userMessage, state.user)
      const botMessage: Message = {
        role: 'assistant',
        content: modelOutput,
        createdAt: new Date()
      }
      state.messages.unshift({
        ...botMessage, user: {
          name: state.user.displayName!,
          photoURL: state.user.photoURL!,
          email: state.user.email!
        }
      })
      await setMessage(botMessage, state.user)
      const { data } = await useFetch(`/api/audio?text=${modelOutput}`, {
        method: "GET",
      }).blob();
      if (!data.value) return;
      const blobAudio = new Blob([data.value], { type: "audio/opus" });
      const audioUrl = URL.createObjectURL(blobAudio);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    isListening,
    result,
    speech,
    fetchAudio,
  };
};
