package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.repository.AcademyData
import com.example.ui.theme.*

@Composable
fun LessonDetailScreen(
    lessonId: String,
    onCompleteLesson: (lessonId: String, score: Int, xpEarned: Int) -> Unit,
    onBack: () -> Unit
) {
    val lesson = AcademyData.getLessonById(lessonId) ?: AcademyData.levels.first().lessons.first()

    // Quiz states
    var selectedAnswers by remember { mutableStateOf(mapOf<Int, Int>()) }
    var quizSubmitted by remember { mutableStateOf(false) }
    var lessonFinished by remember { mutableStateOf(false) }

    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Transparent)
    ) {
        // Top App Bar (Bank Standard)
        Surface(
            color = Color(0xD90A1628),
            border = BorderStroke(1.dp, Color(0x3300F0FF))
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                }
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "Level ${lesson.levelNumber} — ${lesson.levelTitle}",
                        fontSize = 11.sp,
                        color = Color(0xFF00F0FF),
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = lesson.title,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = Color.White,
                        maxLines = 1
                    )
                }
            }
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp)
                .verticalScroll(scrollState),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Spacer(modifier = Modifier.height(4.dp))

            // Subtitle & Header Badge
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    color = Color(0x33FBBF24),
                    shape = RoundedCornerShape(6.dp),
                    border = BorderStroke(1.dp, Color(0x66FBBF24))
                ) {
                    Text(
                        text = "+${lesson.xpReward} XP upon completion",
                        color = Color(0xFFFBBF24),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
                Text(
                    text = "${lesson.readTime} read",
                    fontSize = 12.sp,
                    color = Color(0xFF94A3B8)
                )
            }

            Text(
                text = lesson.title,
                fontSize = 24.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Color.White
            )

            // Short Explanation Card (Bank Standard)
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0x3300F0FF))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.MenuBook, contentDescription = null, tint = Color(0xFF00F0FF), modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Core Explanation", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color(0xFF00F0FF))
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = lesson.shortExplanation,
                        fontSize = 14.sp,
                        lineHeight = 22.sp,
                        color = Color.White
                    )
                }
            }

            // Real-World Example Card (Bank Standard)
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0xFF34D399).copy(alpha = 0.5f))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Lightbulb, contentDescription = null, tint = Color(0xFF34D399), modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Simple Real-World Example", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color(0xFF34D399))
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = lesson.realWorldExample,
                        fontSize = 13.sp,
                        lineHeight = 20.sp,
                        color = Color(0xFFCBD5E1)
                    )
                }
            }

            // Key Takeaways (Bank Standard)
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0x2800F0FF))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text("Key Takeaways", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
                    Spacer(modifier = Modifier.height(10.dp))
                    lesson.keyTakeaways.forEach { takeaway ->
                        Row(
                            modifier = Modifier.padding(vertical = 4.dp),
                            verticalAlignment = Alignment.Top
                        ) {
                            Icon(Icons.Default.Check, contentDescription = null, tint = Color(0xFF34D399), modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(takeaway, fontSize = 13.sp, color = Color(0xFFCBD5E1), lineHeight = 18.sp)
                        }
                    }
                }
            }

            // Knowledge Check Quiz (Bank Standard)
            if (lesson.quizQuestions.isNotEmpty()) {
                Text(
                    text = "Knowledge Check (${lesson.quizQuestions.size} Questions)",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = Color.White
                )

                Spacer(modifier = Modifier.height(4.dp))

                lesson.quizQuestions.forEachIndexed { qIdx, question ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 12.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                        border = BorderStroke(1.dp, Color(0x2800F0FF))
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "Question ${qIdx + 1}: ${question.question}",
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = Color.White
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            question.options.forEachIndexed { optIdx, optionText ->
                                val isSelected = selectedAnswers[qIdx] == optIdx
                                val isCorrect = question.correctIndex == optIdx

                                val borderCol = when {
                                    quizSubmitted && isCorrect -> Color(0xFF34D399)
                                    quizSubmitted && isSelected && !isCorrect -> Color(0xFFEF4444)
                                    isSelected -> Color(0xFF00F0FF)
                                    else -> Color(0x3300F0FF)
                                }

                                Surface(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp)
                                        .clickable(enabled = !quizSubmitted) {
                                            selectedAnswers = selectedAnswers.toMutableMap().apply {
                                                put(qIdx, optIdx)
                                            }
                                        },
                                    shape = RoundedCornerShape(8.dp),
                                    color = if (isSelected) Color(0x3300F0FF) else Color(0x1500F0FF),
                                    border = BorderStroke(1.dp, borderCol)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(12.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        RadioButton(
                                            selected = isSelected,
                                            onClick = {
                                                if (!quizSubmitted) {
                                                    selectedAnswers = selectedAnswers.toMutableMap().apply {
                                                        put(qIdx, optIdx)
                                                    }
                                                }
                                            },
                                            colors = RadioButtonDefaults.colors(selectedColor = Color(0xFF00F0FF))
                                        )
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(
                                            text = optionText,
                                            fontSize = 13.sp,
                                            color = Color.White
                                        )
                                    }
                                }
                            }

                            if (quizSubmitted) {
                                Spacer(modifier = Modifier.height(10.dp))
                                Surface(
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(8.dp),
                                    color = Color(0x22FFFFFF)
                                ) {
                                    Text(
                                        text = question.explanation,
                                        fontSize = 12.sp,
                                        color = Color(0xFFCBD5E1),
                                        modifier = Modifier.padding(10.dp)
                                    )
                                }
                            }
                        }
                    }
                }

                if (!quizSubmitted) {
                    val allAnswered = selectedAnswers.size == lesson.quizQuestions.size
                    Button(
                        onClick = {
                            quizSubmitted = true
                            var correctCount = 0
                            lesson.quizQuestions.forEachIndexed { idx, q ->
                                if (selectedAnswers[idx] == q.correctIndex) correctCount++
                            }
                            val score = ((correctCount.toFloat() / lesson.quizQuestions.size) * 100).toInt()
                            onCompleteLesson(lesson.id, score, lesson.xpReward)
                            lessonFinished = true
                        },
                        enabled = allAnswered,
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00F0FF)),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                            .testTag("submit_quiz_button")
                    ) {
                        Text("Submit Quiz & Earn XP", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color(0xFF040B14))
                    }
                } else {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                        border = BorderStroke(1.dp, Color(0xFF34D399))
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.EmojiEvents, contentDescription = null, tint = Color(0xFFFBBF24), modifier = Modifier.size(28.dp))
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text("Lesson Completed!", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color.White)
                                Text("+${lesson.xpReward} XP points added to your investor level.", fontSize = 12.sp, color = Color(0xFF94A3B8))
                            }
                            Button(
                                onClick = onBack,
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00F0FF)),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text("Done", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF040B14))
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(96.dp))
        }
    }
}
