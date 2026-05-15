// Importa as funções necessárias dos servidores do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// SUAS CHAVES DO FIREBASE (Substitua pelos seus dados reais aqui)
const firebaseConfig = {
    apiKey: "AIzaSyDu9sgSVn_KxMycgHEjSBJDpM4MLhFjAsE",
    authDomain: "polyglot-cards.firebaseapp.com",
    projectId: "polyglot-cards",
    storageBucket: "polyglot-cards.firebasestorage.app",
    messagingSenderId: "749331081680",
    appId: "1:749331081680:web:7f15dfa2b23d2037f6b1d5"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
// Inicializa o Banco de Dados Firestore
const db = getFirestore(app);

// Exporta o banco e as ferramentas para o outro arquivo usar
export { db, collection, getDocs, query, where };
