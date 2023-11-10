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
      const { data } = await useFetch(`/api/audio/${text}`, {
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
