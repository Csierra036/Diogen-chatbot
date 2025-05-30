from langchain_community.llms import ollama
from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.prompts import PromptTemplate
from langchain.chains.retrieval_qa.base import RetrievalQA
from langchain.chains.combine_documents.stuff import StuffDocumentsChain
from langchain.chains.llm import LLMChain

# Configuración global
DB_PATH = "db"
COLLECTION_NAME = "sistemas-operativos"
PDF_PATH = "src/pdf/sistemas-operativos-william-stallings.pdf"

# Cargar LLM
bot = ollama.Ollama(model="deepseek-r1:1.5b")

# Crear prompt
PROMPT = """
Eres un experto en sistemas operativos, por favor responde a las siguientes preguntas basándote en la información proporcionada:
Contexto: {context}
Pregunta: {question}
"""
prompt = PromptTemplate(template=PROMPT, input_variables=["context", "question"])
llm_chain = LLMChain(llm=bot, prompt=prompt)
stuff_chain = StuffDocumentsChain(llm_chain=llm_chain, document_variable_name="context")

# Variables globales
qa = None  # se crea al cargar el documento

def cargar_documento():
    global qa
    print("📄 Cargando documento y creando vector store...")

    loader = PyMuPDFLoader(PDF_PATH)
    data_pdf = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=500)
    docs = text_splitter.split_documents(data_pdf)

    embedding_model = FastEmbedEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    # Guardar en vectorstore persistente
    vs = Chroma.from_documents(
        documents=docs,
        embedding=embedding_model,
        persist_directory=DB_PATH
    )

    retriever = vs.as_retriever(search_kwargs={'k': 3})

    qa = RetrievalQA(
        combine_documents_chain=stuff_chain,
        retriever=retriever,
        return_source_documents=True
    )
    print("✅ Documento cargado y procesado correctamente.")

def consultar():
    if not qa:
        print("⚠️ Debes cargar un documento primero.")
        return
    while True:
        pregunta = input("\n🔍 Ingresa tu pregunta (o escribe 'salir' para volver al menú):\n> ")
        if pregunta.lower() in ['salir', 'exit']:
            break
        response = qa.invoke({"query": pregunta})
        print("\n🤖 Respuesta:\n", response["result"])
        
        if response.get("source_documents"):
            print("\n📚 Fuentes:")
            for i, doc in enumerate(response["source_documents"], 1):
                print(f"\nDocumento {i} - Página {doc.metadata.get('page', 'N/A')}:")
                print(doc.page_content[:200] + "...")


# Menú principal
def main():
    while True:
        print("\n📘 MENÚ PRINCIPAL")
        print("1. Cargar documento PDF")
        print("2. Hacer una consulta")
        print("3. Salir")
        opcion = input("Selecciona una opción (1-3): ")

        if opcion == "1":
            cargar_documento()
        elif opcion == "2":
            consultar()
        elif opcion == "3":
            print("👋 Saliendo...")
            break
        else:
            print("❌ Opción no válida. Intenta de nuevo.")

if __name__ == "__main__":
    main()