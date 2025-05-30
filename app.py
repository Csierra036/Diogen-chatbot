from langchain_community.llms import ollama
from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.prompts import PromptTemplate
from langchain.chains.retrieval_qa.base import RetrievalQA
from langchain.chains.combine_documents.stuff import StuffDocumentsChain
from langchain.chains.llm import LLMChain

# LLM
bot = ollama.Ollama(model="deepseek-r1:1.5b")

# Cargar PDF
loader = PyMuPDFLoader("src/pdf/sistemas-operativos-william-stallings.pdf")
data_pdf = loader.load()

# División del texto
text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=500)
docs = text_splitter.split_documents(data_pdf)

# Embeddings y vector store
embedding_model = FastEmbedEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vs = Chroma.from_documents(
    documents=docs,
    embedding=embedding_model,
    persist_directory="db"
)

# Vector store persistente
vector_store = Chroma(
    embedding_function=embedding_model,
    persist_directory="db",
    collection_name="sistemas-operativos"
)

retriever = vector_store.as_retriever(search_kwargs={'k': 3})

# Prompt personalizado
PROMPT = """
Eres un experto en sistemas operativos, por favor responde a las siguientes preguntas basándote en la información proporcionada:
Contexto: {context}
Pregunta: {question}
"""
prompt = PromptTemplate(template=PROMPT, input_variables=["context", "question"])

# Cadena LLM + documentos
llm_chain = LLMChain(llm=bot, prompt=prompt)
stuff_chain = StuffDocumentsChain(llm_chain=llm_chain, document_variable_name="context")

# RetrievalQA con cadena personalizada
qa = RetrievalQA(
    combine_documents_chain=stuff_chain,
    retriever=retriever,
    return_source_documents=True
)

# Consulta
response = qa.invoke({
    "query": "¿Háblame sobre la planificación de algoritmos?"
})

# Resultado
print("Respuesta:", response["result"])

# Mostrar fuentes si hay
if response.get("source_documents"):
    print("\nFuentes utilizadas:")
    for i, doc in enumerate(response["source_documents"], 1):
        print(f"\nDocumento {i}:")
        print(f"Página {doc.metadata.get('page', 'N/A')}")
        print(doc.page_content[:200] + "...")