from config import STORIES, WORD_SKIP
import random

def get_trial():
    story_name = random.choice(list(STORIES.keys()))
    story = STORIES[story_name]
    fill_in_words = get_fill_in_words(len(story))
    
    output = {
        "storyName": story_name,
        "story": story,
        "fillInWords": fill_in_words,
    }
    return output


def get_fill_in_words(story_length):
    words = []
    word_idx = int(random.random() * WORD_SKIP)

    while word_idx < story_length:
        words.append(word_idx)
        word_idx += (WORD_SKIP-2) + int(random.random() * 5)
        
    return words