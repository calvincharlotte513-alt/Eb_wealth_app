package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

data class QuizQuestion(
    val question: String,
    val options: List<String>,
    val correctIndex: Int,
    val explanation: String
)

data class Lesson(
    val id: String,
    val levelNumber: Int,
    val levelTitle: String,
    val title: String,
    val subtitle: String,
    val readTime: String,
    val xpReward: Int = 50,
    val shortExplanation: String,
    val realWorldExample: String,
    val keyTakeaways: List<String>,
    val quizQuestions: List<QuizQuestion>
)

data class AcademyLevel(
    val levelNumber: Int,
    val title: String,
    val description: String,
    val lessons: List<Lesson>
)

@Entity(tableName = "lesson_progress")
data class LessonProgressEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val userId: Int = 1,
    val lessonId: String,
    val completed: Boolean = true,
    val quizScore: Int = 100,
    val completedAt: Long = System.currentTimeMillis()
)
