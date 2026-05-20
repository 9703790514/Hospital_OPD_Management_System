package training.iqgateway.dto;

//Removed Lombok imports
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;

public class EmailRequest {
 private String to;
 private String subject;
 private String body;
 private String resetLink; // Specific for password reset

 // NoArgsConstructor
 public EmailRequest() {
 }

 // AllArgsConstructor
 public EmailRequest(String to, String subject, String body, String resetLink) {
     this.to = to;
     this.subject = subject;
     this.body = body;
     this.resetLink = resetLink;
 }

 // Getters
 public String getTo() {
     return to;
 }

 public String getSubject() {
     return subject;
 }

 public String getBody() {
     return body;
 }

 public String getResetLink() {
     return resetLink;
 }

 // Setters
 public void setTo(String to) {
     this.to = to;
 }

 public void setSubject(String subject) {
     this.subject = subject;
 }

 public void setBody(String body) {
     this.body = body;
 }

 public void setResetLink(String resetLink) {
     this.resetLink = resetLink;
 }

 @Override
 public String toString() {
     return "EmailRequest{" +
            "to='" + to + '\'' +
            ", subject='" + subject + '\'' +
            ", body='" + body + '\'' +
            ", resetLink='" + resetLink + '\'' +
            '}';
 }

 @Override
 public boolean equals(Object o) {
     if (this == o) return true;
     if (o == null || getClass() != o.getClass()) return false;

     EmailRequest that = (EmailRequest) o;

     if (to != null ? !to.equals(that.to) : that.to != null) return false;
     if (subject != null ? !subject.equals(that.subject) : that.subject != null) return false;
     if (body != null ? !body.equals(that.body) : that.body != null) return false;
     return resetLink != null ? resetLink.equals(that.resetLink) : that.resetLink == null;
 }

 @Override
 public int hashCode() {
     int result = to != null ? to.hashCode() : 0;
     result = 31 * result + (subject != null ? subject.hashCode() : 0);
     result = 31 * result + (body != null ? body.hashCode() : 0);
     result = 31 * result + (resetLink != null ? resetLink.hashCode() : 0);
     return result;
 }
}