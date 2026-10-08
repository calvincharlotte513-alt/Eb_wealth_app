package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.EBEventEntity
import com.example.ui.theme.*

@Composable
fun EventsScreen(
    events: List<EBEventEntity>,
    onToggleRegistration: (Int, Boolean) -> Unit,
    onBack: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Transparent),
        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 96.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Bar (Bank Standard)
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                }
                Spacer(modifier = Modifier.width(6.dp))
                Column {
                    Text(
                        text = "Masterclasses & Workshops",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = Color.White
                    )
                    Text(
                        text = "Live interactive sessions with UK wealth practitioners",
                        fontSize = 11.sp,
                        color = Color(0xFF94A3B8)
                    )
                }
            }
        }

        // Live Events list (Bank Standard)
        items(events) { event ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("event_card_${event.id}"),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0x2800F0FF))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            color = Color(0x3300F0FF),
                            shape = RoundedCornerShape(6.dp),
                            border = BorderStroke(1.dp, Color(0x6600F0FF))
                        ) {
                            Text(
                                text = event.format,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF00F0FF),
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }

                        Surface(
                            color = if (event.spacesRemaining <= 10) Color(0x33FBBF24) else Color(0x22FFFFFF),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = "${event.spacesRemaining} spaces left",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = if (event.spacesRemaining <= 10) Color(0xFFFBBF24) else Color(0xFFCBD5E1),
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = event.title,
                        fontWeight = FontWeight.Bold,
                        fontSize = 17.sp,
                        color = Color.White
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.CalendarToday, contentDescription = null, tint = Color(0xFF00F0FF), modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(event.dateString, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
                        Spacer(modifier = Modifier.width(14.dp))
                        Icon(Icons.Default.Schedule, contentDescription = null, tint = Color(0xFF00F0FF), modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(event.timeString, fontSize = 12.sp, color = Color(0xFF94A3B8))
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = event.description,
                        fontSize = 12.sp,
                        lineHeight = 17.sp,
                        color = Color(0xFF94A3B8)
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "Led by: ${event.host}",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF38BDF8)
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Button(
                        onClick = { onToggleRegistration(event.id, !event.isRegistered) },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (event.isRegistered) Color(0x3310B981) else Color(0xFF00F0FF)
                        ),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("register_event_${event.id}")
                    ) {
                        Text(
                            text = if (event.isRegistered) "✓ Registered (Reserved)" else "Register for Masterclass (Free)",
                            color = if (event.isRegistered) Color(0xFF34D399) else Color(0xFF040B14),
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                    }
                }
            }
        }
    }
}
