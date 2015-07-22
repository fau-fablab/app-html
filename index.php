<!-- <head> part -->
<?php require_once("includes/header.html"); ?>

<!-- <body> begin with navigation -->
<?php require_once("includes/navigation.html"); ?>
      
              
<!-- site content-->
<div id="content" class="container-fluid">

<!-- rotating gif when content is loading -->
<img id="loading" src="img/loading.gif" alt="loading" />

<!-- load news.html into #content -->
<script>
    $(function(){
          $("#content").load("news.html");
    });
</script>
    
</div>

    
<!-- (empty) footer with </body> and </html> -->
<?php require_once("includes/footer.html"); ?>
