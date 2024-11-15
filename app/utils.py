import openai
from sqlalchemy.orm import Session
from app.crud import update_translation_task
from dotenv import load_dotenv
import os
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY


def perform_translation(task_id: int, text: str, languages: list, db: Session):
    translations = {}
    for lang in languages:
        try:
            """
            response = openai.chatCompletion.create(
                model='gpt-4',
                messages=[
                    {"role": "system",
                        "context": f"assistant that translate text into {lang}."},
                    {"role": "user", "context": text}
                ],
                max_tokens=1000
            )
            translated_text = response['choices'][0]['message']['context'].strip(
            )
            translations[lang] = translated_text
            """
            translated_text = ['one', 'two', 'three']
            translations = translated_text
        except Exception as e:
            print(f"Error Translating to {lang}:{e}")
            translations[lang] = f"Error: {e}"
        except Exception as e:
            print(f"Unexcepted error:{e}")
            translations[lang] = f"Unexpected error:{e}"

        update_translation_task(db, task_id, translations)
