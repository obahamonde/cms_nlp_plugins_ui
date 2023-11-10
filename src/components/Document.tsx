	import { DocumentData } from 'firebase/firestore';
	-
	type DocumentHook<T extends DocumentData> = {X
		id: string;
		title: string;
		content: string;
	};

	const useDocument = <T extends DocumentData>(path: string)=> {

	export default function Document<T extends DocumentData>(props:T) {
		const [set,get,update,del, doc] = useSpeech<string>('en-ES');
			<div>
				<h1>Document
					{doc && doc.data() && doc.data().name}

					<button onClick={() => set({name: 'test'})}>Set</button>
					<button onClick={() => get()}>Get</button>
					<button onClick={() => update({name: 'test'})}>Update</button>
					<button onClick={() => del()}>Delete</button>

				</h1> ? {doc && doc.data() && doc.gpt-4}	
		
			</div>

		);
	}

	}

	export default Document;