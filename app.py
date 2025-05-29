from langchain_community.llms import ollama
from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain_community.vectorstores import Chroma
#from langchain_chroma import Chroma
from langchain.prompts import PromptTemplate
from langchain.chains.retrieval_qa.base import RetrievalQA

bot = ollama.Ollama(model="deepseek-r1:1.5b")

bot.invoke("Hola quien eres?")
loder = PyMuPDFLoader("src/pdf/sistemas-operativos-william-stallings.pdf")

data_pdf = loder.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=500)
docs = text_splitter.split_documents(data_pdf)
print("\n\n\n")
# print(FastEmbedEmbeddings.list_supported_models())
print("\n\n\n")
embend_model = FastEmbedEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

vs = Chroma.from_documents(
    documents=docs,
    embedding=embend_model,
    persist_directory="db"
)

vector_store = Chroma(
    embedding_function=embend_model,  # Cambiado a embedding_function
    persist_directory="db",
    collection_name="sistemas-operativos"
)
retrieve = vector_store.as_retriever(search_kwargs={'k': 3})
PROMPT = """
Eres un experto en sistemas operativos, por favor responde a las siguientes preguntas basándote en la información proporcionada:
Contexto: {context}
Pregunta: {question}
"""

prompt = PromptTemplate(template=PROMPT, input_variables=['context', "question"])
qa= RetrievalQA(
    llm=bot,
    retriever=retrieve,
    chain_type="stuff",
    chain_type_kwargs={"prompt": prompt},
    return_source_documents=True
)

response = qa.invoke({
    "question": "¿Hablame sobre la planificacion de algoritmos?",
    "context": "Los algoritmos de planitifacion son instrucciones en el cual el procesador trata de ejecutar tareas de manera eficiente y justa."
})

print("Respuesta:", response["result"])

# Mostrar fuentes si es necesario
if response["source_documents"]:
    print("\nFuentes utilizadas:")
    for i, doc in enumerate(response["source_documents"], 1):
        print(f"\nDocumento {i}:")
        print(f"Página {doc.metadata.get('page', 'N/A')}")
        print(doc.page_content[:200] + "...")