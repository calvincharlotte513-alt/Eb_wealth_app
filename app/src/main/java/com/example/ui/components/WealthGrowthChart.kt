package com.example.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*
import kotlin.math.pow

@Composable
fun WealthGrowthChart(
    monthlyContribution: Double,
    years: Int = 25,
    annualReturn: Double = 0.07,
    modifier: Modifier = Modifier
) {
    // Generate data points for years 0 to years
    val points = remember(monthlyContribution, years, annualReturn) {
        val list = mutableListOf<Pair<Int, Double>>()
        val r = annualReturn / 12.0
        for (y in 0..years) {
            val months = y * 12
            val fv = if (r > 0) {
                monthlyContribution * (((1.0 + r).pow(months.toDouble()) - 1.0) / r)
            } else {
                monthlyContribution * months
            }
            list.add(y to fv)
        }
        list
    }

    val maxVal = points.lastOrNull()?.second ?: 100000.0
    var selectedPointIndex by remember { mutableIntStateOf(years) }

    val animProgress = remember { Animatable(0f) }
    LaunchedEffect(monthlyContribution, years, annualReturn) {
        animProgress.snapTo(0f)
        animProgress.animateTo(
            targetValue = 1f,
            animationSpec = tween(durationMillis = 1000, easing = FastOutSlowInEasing)
        )
    }

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = RoyalBlueDark),
        border = CardDefaults.outlinedCardBorder().copy(
            brush = Brush.linearGradient(
                colors = listOf(
                    GoldAccentLight.copy(alpha = 0.5f),
                    RoyalBlueLight.copy(alpha = 0.3f),
                    Color.Transparent
                )
            )
        )
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "COMPOUNDING TRAJECTORY",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = GoldAccentLight,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    val selectedValue = points.getOrNull(selectedPointIndex)?.second ?: maxVal
                    val selectedYear = points.getOrNull(selectedPointIndex)?.first ?: years
                    Text(
                        text = "£${String.format("%,.0f", selectedValue)}",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color.White
                    )
                    Text(
                        text = "Projected value at Year $selectedYear (@ ${(annualReturn * 100).toInt()}% annual growth)",
                        fontSize = 11.sp,
                        color = Color.White.copy(alpha = 0.75f)
                    )
                }

                Surface(
                    color = EmeraldGreenContainer.copy(alpha = 0.25f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = "Interactive Curve",
                        color = EmeraldGreenLight,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Canvas Line Chart with Gradient Shading
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(140.dp)
                    .pointerInput(points) {
                        detectTapGestures { offset ->
                            val fraction = (offset.x / size.width).coerceIn(0f, 1f)
                            val idx = (fraction * (points.size - 1)).toInt().coerceIn(0, points.size - 1)
                            selectedPointIndex = idx
                        }
                    }
            ) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    val w = size.width
                    val h = size.height
                    val paddingBottom = 16f

                    if (points.size < 2) return@Canvas

                    val path = Path()
                    val fillPath = Path()

                    val firstX = 0f
                    val firstY = h - paddingBottom

                    path.moveTo(firstX, firstY)
                    fillPath.moveTo(firstX, firstY)

                    val stepX = w / (points.size - 1)

                    var prevX = firstX
                    var prevY = firstY

                    for (i in 1 until points.size) {
                        val x = i * stepX
                        val normalizedY = ((points[i].second / maxVal) * (h - paddingBottom - 10f)).toFloat() * animProgress.value
                        val y = (h - paddingBottom) - normalizedY

                        val cX1 = (prevX + x) / 2
                        val cY1 = prevY
                        val cX2 = (prevX + x) / 2
                        val cY2 = y

                        path.cubicTo(cX1, cY1, cX2, cY2, x, y)
                        fillPath.cubicTo(cX1, cY1, cX2, cY2, x, y)

                        prevX = x
                        prevY = y
                    }

                    fillPath.lineTo(w, h)
                    fillPath.lineTo(0f, h)
                    fillPath.close()

                    // Draw Gradient Fill under line
                    drawPath(
                        path = fillPath,
                        brush = Brush.verticalGradient(
                            colors = listOf(
                                EmeraldGreenLight.copy(alpha = 0.35f),
                                RoyalBluePrimary.copy(alpha = 0.1f),
                                Color.Transparent
                            ),
                            startY = 0f,
                            endY = h
                        )
                    )

                    // Draw Glowing Stroke Line
                    drawPath(
                        path = path,
                        brush = Brush.horizontalGradient(
                            colors = listOf(
                                RoyalBlueLight,
                                EmeraldGreenLight,
                                GoldAccentLight
                            )
                        ),
                        style = Stroke(width = 3.5.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
                    )

                    // Draw Indicator Dot on selected index
                    val selectedX = selectedPointIndex * stepX
                    val selectedNormalizedY = ((points[selectedPointIndex].second / maxVal) * (h - paddingBottom - 10f)).toFloat() * animProgress.value
                    val selectedY = (h - paddingBottom) - selectedNormalizedY

                    drawCircle(
                        color = Color.White,
                        radius = 6.dp.toPx(),
                        center = Offset(selectedX, selectedY)
                    )
                    drawCircle(
                        color = GoldAccent,
                        radius = 4.dp.toPx(),
                        center = Offset(selectedX, selectedY)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Year markers
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Year 0", fontSize = 10.sp, color = Color.White.copy(alpha = 0.6f))
                Text("Year ${(years / 2)}", fontSize = 10.sp, color = Color.White.copy(alpha = 0.6f))
                Text("Year $years", fontSize = 10.sp, color = GoldAccentLight, fontWeight = FontWeight.Bold)
            }
        }
    }
}
