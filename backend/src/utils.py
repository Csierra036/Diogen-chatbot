from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hashear la contraseña
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Verificar si coincide el hash con la contraseña en texto plano
def verify_password(password_input: str, hashed_password: str) -> bool:
    return pwd_context.verify(password_input, hashed_password)